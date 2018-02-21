import Server, { Context, Headers } from '@syncano/core';
import Ajv from 'ajv';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import get from 'lodash.get';
import merge from 'lodash.merge';
import nodeFetch from 'node-fetch';
import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

function makeAjv(): Ajv.Ajv {
  const ajv = new Ajv({$data: true});
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
  require('ajv-merge-patch')(ajv);
  require('ajv-keywords')(ajv);
  return ajv;
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
export class Schema extends Validator {
  private ajv: Ajv.Ajv;
  private paramId: string;
  private name: string;
  private socket: string;
  private endpoint: string;
  private parameter: string;
  private ctx?: Context;
  private syncano?: Server;
  constructor(opts: any,
              key: string,
              attributes: object,
              globalOptions?: object) {
    opts = {schema: get(opts, '$schema', opts)};
    super('schema', opts, key, attributes, globalOptions);
    this.syncano   = get(this, 'globalOptions.syncano');
    this.ctx       = get(this, 'globalOptions.ctx');
    this.name      = (get(this, 'ctx.meta.executor') ||
                      get(this, 'ctx.meta.name') ||
                      'socket/endpoint');
    this.name      = `${this.name}/${key}`;
    this.socket    = this.name.split('/')[0];
    this.endpoint  = this.name.split('/')[1];
    this.parameter = this.name.split('/')[2];
    this.ajv = this.name === `socket/endpoint/${key}` ? makeAjv() : globalAjv;
    this.paramId = this.makeId(this.name);
  }

  public async test(value: any, ctx?: Context): Promise<boolean> {
    if (!validateJs.isDefined(value)) {
      return true;
    }
    const validate = await this.getSchema();
    if (!validate(value)) {
      this.msg =  this.opts.message ||
                  validate.errors ||
                  'does not match schema';
      return false;
    }
    return true;
  }

  private makeId(schemaId: string): string {
    if (this.syncano) {
      return `${this.syncano.endpoint._url(this.socket + '/' + this.endpoint)}${schemaId}/$schema`;
    }
    return  `http://local/schemas/${schemaId}/$schema`;
  }

  private async fetchSocketJSON(): Promise<any> {
    if (!this.syncano) {
      return;
    }
    const {instanceName, host} = get(this, 'syncano.socket.instance', {});
    if (!instanceName) {
      return;
    }
    const token = this.syncano.socket.instance.token || this.syncano.socket.instance.token;
    if (!token) {
        return;
      }
    const headers: Headers = {
        'X-API-KEY': token,
      };
    const url = this.syncano.socket.url(this.socket);

    return new Promise<ISocketJSON|undefined>((resolve: any, reject: any): (ISocketJSON|undefined) => {
      if (!this.syncano) {
        resolve();
        return;
      }
      this.syncano.socket.fetch(url, {}, headers)
        .then((v: ISocketJSON) => resolve(v))
        .catch(reject);
    }).then(socketMeta => {
      const socketYml = get(socketMeta, ['files', 'socket.yml', 'file']);
      return nodeFetch(socketYml)
        .then(r => r.buffer())
        .then(b => yaml.safeLoad(b.toString()))
        .then((socketJson: ISocketJSON) => socketJson);
    })
    .catch(e => undefined);
  }

  private async makeSocketSchema() {
    let socketJson = await this.fetchSocketJSON();
    if (!socketJson) {
      return;
    }
    for (const k of Object.keys(socketJson)) {
      if (k === '$source') {

        try {
          let fn = socketJson[k];
          if (!(fn.startsWith('/'))) {
            fn = '/app/code/' + fn;
          }
          const extraYaml = yaml.safeLoad(readFileSync(fn).toString());
          socketJson = merge(socketJson, extraYaml);
        } catch (e) {
          // Just pass
        }
        continue;
      }
      if (typeof socketJson[k] !== 'object') {
        continue;
      }
      if ('$source' in socketJson[k]) {
        try {
          let fn = socketJson[k].$source;
          if (!(fn.startsWith('/'))) {
            fn = '/app/code/' + fn;
          }
          const extraYaml = yaml.safeLoad(readFileSync(fn).toString());
          socketJson[k] = extraYaml;
        } catch (e) {
          // Just pass
        }
      }
    }
    const socketId: string = this.makeId(this.socket);
    this.ajv.addSchema({
      ...socketJson,
      $id: socketId,
    });
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
    this.ajv.addSchema({
      ...this.opts.schema,
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

export default (value: any,
                opts: any,
                key: string,
                attributes: object,
                globalOptions?: object): Promise<ValidationResult> =>
  (new Schema(opts, key, attributes, globalOptions).validate(value));
