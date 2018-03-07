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
  method?: string;
  metaOnly?: boolean;
}
export class Schema {
  public ajv: Ajv.Ajv;
  private metaOnly?: boolean;
  private name: string;
  private socket: string;
  private endpoint: string;
  private method: string;
  private parameter: string;
  private ctx: Context;
  private socketFile?: string|Buffer;
  private syncano?: Server;
  constructor(opts: ISchemaOpts) {
    this.syncano   = opts.syncano;
    this.ctx       = opts.ctx;
    this.metaOnly = opts.metaOnly;
    this.name      = (opts.endpoint ||
                      get(this, 'ctx.meta.executor') ||
                      get(this, 'ctx.meta.name') ||
                      'socket/endpoint');
    this.socketFile = opts.socketFile;
    this.method = opts.method || get(this, 'ctx.meta.request.REQUEST_METHOD', '*');
    this.name      = `${this.name}/${this.method}-inputs`;
    this.socket    = this.name.split('/')[0];
    this.endpoint  = this.name.split('/')[1];
    this.parameter = this.name.split('/')[2];
    this.ajv = this.name === `socket/endpoint/${this.method}-inputs` ? makeAjv() : globalAjv;
  }

  public async validate(args: RequestArgs): Promise<boolean> {
    const validate = await this.getSchema();
    const valid = await validate(args);
    if (!valid) {
      throw validate.errors;
    }
    return valid;
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
    const url = this.syncano.socket.url(this.socket);

    return fetchSocketYml(this.syncano, this.socket)
      .then(b => yaml.safeLoad(b.toString()))
      .then((socketJson: ISocketJSON) => socketJson)
      .catch(e => undefined);
  }

  private async makeSocketSchema(): Promise<boolean> {
    if (this.metaOnly) {
      return false;
    }
    // Socket schema already loaded?
    if (this.ajv.getSchema(this.socketId)) {
      return true;
    }
    const socketJson = await this.fetchSocketJSON();
    if (!socketJson) {
      return false;
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
    return true;
  }

  private makeRefSchema(ref: string) {
    this.ajv.addSchema({
      $ref: ref,
    }, this.paramId);
  }

  private get paramId() {
    return `${this.method}-thisParam`;
  }

  private get socketRoot() {
    return this.makeId(this.socket);
  }

  private get socketId() {
    return  this.socketRoot + '/socket.yml';
  }

  private async makeSchema(): Promise<Ajv.ValidateFunction> {
    let ref = '';
    let hasSocketSchema = false;
    try {
      hasSocketSchema = await this.makeSocketSchema();
      ref = get(this, `ctx.meta.metadata.inputs.${this.method}`) ?
        `${this.socketId}#/endpoints/inputs/${this.method}` :
        `${this.socketId}#/endpoints/inputs`;
    } catch (e) {
      if (this.syncano) {
        this.syncano.logger(`${this.socket}/${this.endpoint}`).error(e);
      }
    }

    // Create schema based on local metadata.
    const metaId = 'http://local/meta';
    if (!this.ajv.getSchema(metaId)) {
      this.ajv.addSchema({
        ...get(this, 'ctx.meta.metadata'),
        $id: metaId,
      });
    }
    if (!hasSocketSchema) {
      ref = get(this, `ctx.meta.metadata.inputs.${this.method}`) ?
        `${metaId}#/inputs/${this.method}` :
        `${metaId}#/inputs`;
    }
    this.makeRefSchema(ref);
    const schema = this.ajv.getSchema(this.paramId);
    return schema;
  }

  private async getSchema(): Promise<Ajv.ValidateFunction> {
    return await this.ajv.getSchema(this.paramId) || await this.makeSchema();
  }
}
