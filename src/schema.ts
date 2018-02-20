import { Context } from '@syncano/core';
import Ajv from 'ajv';
import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class Schema extends Validator {
  constructor(opts: any, key: string, attributes: object) {
    super('schema', opts, key, attributes);
  }

  public test(value: any, ctx?: Context): boolean {
    const ajv = new Ajv();
    if (ctx) {
      ajv.addSchema({...ctx, $id: 'http://local/socket.json'});
    }
    const validate = ajv.compile(this.opts.schema);
    if (!validate(value)) {
      this.msg = validate.errors || 'does not match schema';
    }
    return true;
  }
}

export default (value: any, opts: any, key: string, attributes: object): ValidationResult =>
  (new Schema(opts, key, attributes).validate(value));
