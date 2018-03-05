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
  socketFile?: string;
  endpoint?: string;
  method?: string;
}
export class Schema {
  public ajv: Ajv.Ajv;
  private paramId: string;
  private name: string;
  private socket: string;
  private endpoint: string;
  private method: string;
  private parameter: string;
  private ctx: Context;
  private socketFile?: string;
  private syncano?: Server;
  constructor(opts: ISchemaOpts) {
    this.syncano   = opts.syncano;
    this.ctx       = opts.ctx;
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
    this.paramId = this.makeId(this.name);
  }

  public async validate(args: RequestArgs): Promise<boolean> {
    const validate = await this.getSchema();
    const valid = await validate(args);
    if (!valid) {
      throw validate.errors;
    }
    return valid;
  }

  private async loadYamlSchema(fn: string): Promise<object|undefined> {
    try {
      const getFilename = async () => {
        if (fn.startsWith('/')) {
          return fn;
        }
        // Is it a local run with socket file path?
        // If not attempt to find app path by 'main' script.
        const rootDir = this.socketFile ?
          path.join(path.dirname(this.socketFile), 'src') :
          path.dirname(get(require, 'main.filename'));
        return stat(path.join(rootDir, fn)).then(s => {
          if (s) {
              return path.join(rootDir, fn);
            }
            // Try current workdir.
          return fn;
        });
      };
      return getFilename().then(
        (f: string) => readFile(f).then(b => yaml.safeLoad(b.toString())));
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
      return readFile(this.socketFile).then(b => yaml.safeLoad(b.toString()));
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

  private async makeSocketSchema() {
    const socketJson = await this.fetchSocketJSON();
    if (!socketJson) {
      return;
    }
    const socketId: string = this.makeId(this.socket);
    this.ajv.addSchema({
      ...socketJson,
      $id: socketId,
    });
    if (socketJson.schemas) {
      const schemaPromises = [];
      for (const schema of Object.keys(socketJson.schemas)) {
        // Embeded schema in socket.
        let p: Promise<any>;
        if (typeof socketJson.schemas[schema] === 'object') {
          p = Promise.resolve({
            $id: `${socketId}/${schema}`,
            ...socketJson.schemas[schema],
          });
        } else {
          // Try to open schema file.
          p = this.loadYamlSchema(socketJson.schemas[schema]).then(
            schemaObj => ({
              $id: `${socketId}/${schema}`,
              ...schemaObj,
            }),
          );
        }
        if (p) {
          schemaPromises.push(p);
        }
      }
      const schemas = await Promise.all(schemaPromises);
      for (const schema of schemas) {
        this.ajv.addSchema(schema);
      }
    }
  }

  private makeEndpointSchema() {
    if (!this.ctx) {
      return;
    }
    const endpointId: string = this.makeId(`${this.socket}/${this.endpoint}`);
    this.ajv.addSchema({
      ...get(this.ctx, 'meta.metadata', {}),
      $id: endpointId,
    });
  }

  private async makeSchema(): Promise<Ajv.ValidateFunction> {
    const inputs = get(this, `ctx.meta.metadata.inputs.${this.method}`) ||
      get(this, 'ctx.meta.metadata.inputs') || {};
    this.ajv.addSchema({
      ...inputs,
      $id: this.paramId,
    });
    this.makeEndpointSchema();
    try {
      await this.makeSocketSchema();
    } catch (e) {
      if (this.syncano) {
        this.syncano.logger(`${this.socket}/${this.endpoint}`).error(e);
      }
    }
    return this.ajv.getSchema(this.paramId);
  }

  private async getSchema(): Promise<Ajv.ValidateFunction> {
    return await this.ajv.getSchema(this.paramId) || await this.makeSchema();
  }
}
