import Server, { Context, Headers, RequestArgs } from '@syncano/core';
import Ajv from 'ajv';
import bluebird from 'bluebird';
import fs from 'fs';
import yaml from 'js-yaml';
import get from 'lodash.get';
import has from 'lodash.has';
import merge from 'lodash.merge';
import unset from 'lodash.unset';
import nodeFetch from 'node-fetch';
import path from 'path';

const readFile = bluebird.promisify(fs.readFile);
const stat = bluebird.promisify(fs.stat);

function makeAjv(): Ajv.Ajv {
  const ajv = new Ajv({$data: true});
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
  require('ajv-merge-patch')(ajv);
  require('ajv-keywords')(ajv);
  return ajv;
}

async function fetchSocketYml(syncano: Server, socket: string): Promise<Buffer> {
    const {instanceName, host} = get(syncano, 'socket.instance', {});
    if (!instanceName) {
      throw new Error('Missing instance name');
    }
    const token = syncano.socket.instance.token;
    if (!token) {
      throw new Error('Missing token');
    }
    const headers: Headers = {
        'X-API-KEY': token,
      };
    const url = syncano.socket.url(socket);

    return new Promise<ISocketJSON|undefined>((resolve: any, reject: any)  => {
      syncano.socket.fetch(url, {}, headers)
        .then((v: ISocketJSON) => resolve(v))
        .catch(reject);
    }).then(socketMeta => {
      const socketYml = get(socketMeta, ['files', 'socket.yml', 'file']);
      return nodeFetch(socketYml)
        .then(r => r.buffer());
    });
}

interface ISocketJSONFile {
  file: string;
}
interface ISocketJSONFiles {
  [s: string]: ISocketJSONFile;
}
interface ISocketJSON {
  files: ISocketJSONFiles;
}

const globalAjv = makeAjv();

export interface ISchemaOpts {
  ctx: Context;
  syncano?: Server;
  socketFile?: string|Buffer;
  endpoint?: string;
  metaOnly?: boolean;
}
export class SchemaBuilder {
  public ajv: Ajv.Ajv;
  private metaOnly?: boolean;
  private name: string;
  private ctx: Context;
  private socketFile?: string|Buffer;
  private syncano?: Server;
  constructor(opts: ISchemaOpts) {
    this.syncano   = opts.syncano;
    this.ctx       = opts.ctx;
    this.metaOnly  = opts.metaOnly;
    this.name      = (opts.endpoint ||
                      get(this, 'ctx.meta.executor') ||
                      get(this, 'ctx.meta.name') ||
                      'socket/endpoint');
    this.socketFile = opts.socketFile;
    this.ajv = this.name === 'socket/endpoint' ? makeAjv() : globalAjv;
  }

  public async getSchema(targetRef: string): Promise<Ajv.ValidateFunction> {
    return await this.ajv.getSchema(this.paramId(targetRef)) ||
        await this.makeSchema(targetRef);
  }

  // Hack to avoid unnecessary download of socket.yml upstream.
  private async socketInAppCode(): Promise<boolean> {
    return stat('/app/code/_socket.yml').then(s => {
        return true;
      },
    ).catch(() => false);
  }

  private async loadYamlSchema(fn: string|Buffer): Promise<object|undefined> {
    try {
      const getFile = async () => {
        if (Buffer.isBuffer(fn)) {
          return fn;
        }
        if (fn.startsWith('/')) {
          return readFile(fn);
        }
        // Is it a local run with socket file path?
        // If not attempt to find app path by 'main' script.
        const rootDir = typeof this.socketFile === 'string' ?
          path.join(path.dirname(this.socketFile), 'src') :
          path.dirname(get(require, 'main.filename'));
        return stat(path.join(rootDir, fn)).then(s => {
          if (s) {
              return path.join(rootDir, fn);
            }
            // Try current workdir.
          return fn;
        }).then(s => readFile(s));
      };
      return getFile().then(b => yaml.safeLoad(b.toString()));
    } catch (e) {
      // Just pass
    }
    return;
  }

  private makeId(schemaId: string): string {
    if (this.syncano) {
      const {spaceHost, instanceName} = this.syncano.instance.instance;
      return `https://${instanceName}.${spaceHost}/${schemaId}`;
    }
    return  `http://local/schemas/${schemaId}`;
  }

  private async fetchSocketJSON(): Promise<any> {
    if (this.socketFile) {
      const sockBuf = Buffer.isBuffer(this.socketFile)
        ? this.socketFile
        : await readFile(this.socketFile);
      return this.loadYamlSchema(sockBuf);
    }
    if (!this.syncano) {
      return;
    }
    let pb: Promise<Buffer>;
    if (await this.socketInAppCode()) {
      pb = new Promise((resolve, reject) => {
        readFile('/app/code/_socket.yml').then(resolve).catch(reject);
      });
    } else {
      const {instanceName, host} = get(this, 'syncano.socket.instance', {});
      if (!instanceName) {
        return;
      }
      const token = this.syncano.socket.instance.token;
      if (!token) {
          return;
        }
      const headers: Headers = {
          'X-API-KEY': token,
        };
      const url = this.syncano.socket.url(this.socketName);
      pb = fetchSocketYml(this.syncano, this.socketName);
    }

    return pb
      .then((b: Buffer) => yaml.safeLoad(b.toString()))
      .then((socketJson: ISocketJSON) => socketJson)
      .catch(e => undefined);
  }

  private async makeSocketSchema() {
    if (this.metaOnly ||
      // Socket schema already loaded?
      this.ajv.getSchema(this.socketId)) {
      return;
    }
    const socketJson = await this.fetchSocketJSON();
    if (!socketJson) {
      return;
    }
    this.ajv.addSchema({
      ...socketJson,
      $id: this.socketId,
    });
    if (socketJson.schemas) {
      const schemaPromises = [];
      for (const schema of Object.keys(socketJson.schemas)) {
        // Embeded schema in socket.
        let p: Promise<any>;
        if (typeof socketJson.schemas[schema] === 'object') {
          p = Promise.resolve({
            $id: `${this.socketRoot}/${schema}`,
            ...socketJson.schemas[schema],
          });
        } else {
          // Try to open schema file.
          p = this.loadYamlSchema(socketJson.schemas[schema]).then(
            schemaObj => ({
              $id: `${this.socketRoot}/${schema}`,
              ...schemaObj,
            }),
          );
        }
        if (p) {
          schemaPromises.push(p);
        }
      }
      const schemas = await Promise.all(schemaPromises);
      schemas.forEach(v => this.ajv.addSchema(v));
    }
  }

  private paramId(ref: string) {
    ref = `${this.refRoot}${ref}`;
    return ref.substr(ref.search('#') + 2).replace('/', '-');
  }

  private makeRefSchema(ref: string) {
    this.ajv.addSchema({
      $ref: `${this.refRoot}${ref}`,
    }, this.paramId(ref));
  }

  private get metaId() {
    return 'http://local/meta';
  }

  private get refRoot() {
    if (this.ajv.getSchema(this.socketId)) {
      return `${this.socketId}#/endpoints/`;
    }
    return `${this.metaId}#/`;
  }

  private get socketName() {
    return this.name.split('/')[0];
  }

  private get socketRoot() {
    return this.makeId(this.socketName);
  }

  private get socketId() {
    return  this.socketRoot + '/socket.yml';
  }

  private async makeSchema(targetRef: string): Promise<Ajv.ValidateFunction> {
    try {
      await this.makeSocketSchema();
    } catch (e) {
      if (this.syncano) {
        this.syncano.logger(this.name).error(e);
      }
    }

    // Create schema based on local metadata.
    if (!this.ajv.getSchema(this.metaId)) {
      this.ajv.addSchema({
        ...get(this, 'ctx.meta.metadata'),
        $id: this.metaId,
      });
    }
    this.makeRefSchema(targetRef);
    return this.ajv.getSchema(this.paramId(targetRef));
  }
}
