import isEqual from 'lodash.isequal';
import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

interface ITypeTest {
  any: (value: any) => boolean;
  array: (value: any) => boolean;
  boolean: (value: any) => boolean;
  datetime: (value: any) => boolean;
  integer: (value: any) => boolean;
  number: (value: any) => boolean;
  object: (value: any) => boolean;
  string: (value: any) => boolean;
  [s: string]: ((value: any) => boolean);
}

export class Type extends Validator {
  constructor(opts: any, key: string, attributes: object) {
    if (typeof opts === 'string') {
      opts = {type: opts};
    }
    if ('enum' in opts) {
      opts.type = 'enum';
    }
    if (!('message' in opts)) {
      opts.message = '%(key)s must be %(type)s';
    }
    super('type', opts, key, attributes);
  }

  public test(value: any): boolean {
    const f: ITypeTest = {
      any: () => true,
      array: validateJs.isArray,
      boolean: validateJs.isBoolean,
      datetime: validateJs.isDate,
      enum: () => {
        for (const e in this.opts.enum) {
          if (isEqual(value, this.opts.enum[e])) {
            return true;
          }
        }
        return false;
      },
      integer: validateJs.isInteger,
      number: validateJs.isNumber,
      object: validateJs.isObject,
      string: validateJs.isString,
    };
    if (!(this.opts.type in f)) {
      throw new Error('validator error: unsupported type.');
    }
    return !validateJs.isDefined(value) || f[this.opts.type](value);
  }
}

export default (value: any, opts: any, key: string, attributes: object): ValidationResult =>
  (new Type(opts, key, attributes).validate(value));
