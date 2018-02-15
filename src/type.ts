import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

interface ITypeTest {
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
  constructor(opts: any) {
    if (typeof opts === 'string') {
      opts = {type: opts};
    }
    if (!('message' in opts)) {
      opts.message = '$(value)s must be $(type)s';
    }
    super('type', opts);
  }

  public test(value: any): boolean {
    const f: ITypeTest = {
      array: validateJs.isArray,
      boolean: validateJs.isBoolean,
      datetime: validateJs.isDate,
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

export default (value: any, opts: any): ValidationResult =>
  (new Type(opts).validate(value));
