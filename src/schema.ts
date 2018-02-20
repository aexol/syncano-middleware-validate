import { Context } from '@syncano/core';
import Ajv from 'ajv';
import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class Schema extends Validator {
  private ajv: Ajv.Ajv;
  constructor(opts: any,
              key: string,
              attributes: object,
              globalOptions?: object) {
    if (!('schema' in opts)) {
      opts = {schema: opts};
    }
    super('schema', opts, key, attributes, globalOptions);
    const schemas: any[] = [
      {
        ...this.opts.schema,
        $id: 'http://local/schemas/parameter',
      },
    ];
    const ctx = (this.globalOptions || {}).ctx;
    if (ctx) {
      schemas.push({
        ...(ctx.meta || {}).metadata,
        $id: 'http://local/schemas/endpoint',
      });
    }
    this.ajv = new Ajv({schemas});
    require('ajv-merge-patch')(this.ajv);
    require('ajv-keywords')(this.ajv);
  }

  public test(value: any, ctx?: Context): boolean {
    if (!validateJs.isDefined(value)) {
      return true;
    }
    const validate = this.ajv.getSchema('http://local/schemas/parameter');
    if (!validate(value)) {
      this.msg =  this.opts.message ||
                  validate.errors ||
                  'does not match schema';
      return false;
    }
    return true;
  }
}

export default (value: any, opts: any, key: string, attributes: object, globalOptions?: object): ValidationResult =>
  (new Schema(opts, key, attributes, globalOptions).validate(value));
