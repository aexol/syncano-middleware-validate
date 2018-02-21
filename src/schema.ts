import { Context } from '@syncano/core';
import Ajv from 'ajv';
import get from 'lodash.get';
import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

function makeAjv(): Ajv.Ajv {
  const ajv = new Ajv();
  require('ajv-merge-patch')(ajv);
  require('ajv-keywords')(ajv);
  return ajv;
}

const globalAjv = makeAjv();
export class Schema extends Validator {
  private ajv: Ajv.Ajv;
  private paramId: string;
  private name: string;
  private ctx?: Context;
  constructor(opts: any,
              key: string,
              attributes: object,
              globalOptions?: object) {
    opts = {schema: get(opts, 'schema', opts)};
    super('schema', opts, key, attributes, globalOptions);
    this.ctx  = get(this, 'globalOptions.ctx');
    this.name = get(this, 'ctx.meta.executor') ||
                get(this, 'ctx.meta.name') ||
                'local';
    this.ajv = this.name === 'local' ? makeAjv() : globalAjv;
    this.paramId = this.makeId('parameter');
  }

  public test(value: any, ctx?: Context): boolean {
    if (!validateJs.isDefined(value)) {
      return true;
    }
    const validate = this.getSchema();
    if (!validate(value)) {
      this.msg =  this.opts.message ||
                  validate.errors ||
                  'does not match schema';
      return false;
    }
    return true;
  }

  private makeId(schemaId: string): string {
    return  `http://${this.name}/schemas/${schemaId}`;
  }

  private makeSchema(): Ajv.ValidateFunction {
    this.ajv.addSchema({
      ...this.opts.schema,
      $id: this.paramId,
    });
    if (this.ctx) {
      const endpointId: string = this.makeId('endpoint');
      this.ajv.addSchema({
        ...get(this.ctx, 'meta.metadata', {}),
        $id: endpointId,
      });
    }
    return this.ajv.getSchema(this.paramId);
  }

  private getSchema(): Ajv.ValidateFunction {
    return this.ajv.getSchema(this.paramId) || this.makeSchema();
  }
}

export default (value: any, opts: any, key: string, attributes: object, globalOptions?: object): ValidationResult =>
  (new Schema(opts, key, attributes, globalOptions).validate(value));
