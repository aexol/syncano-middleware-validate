import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class AnyOf extends Validator {
  private anyOf: string[];
  constructor(opts: any, key: string, attributes: object) {
    if (typeof opts !== 'object') {
      opts.parameters = opts;
    }
    if (!('message' in opts)) {
      opts.message = 'atleast one of %(parameters)s is required';
    }
    super('anyOf', opts, key, attributes);
    this.anyOf = [];
    if (Array.isArray(opts.parameters)) {
      const aOpts: any[] = opts;
      for (const i in opts) {
        if (typeof opts[i] === 'string') {
          this.anyOf.push(opts[i]);
        }
      }
    }
  }

  public test(value: any): boolean {
    const checkValue = (v: any) =>
      validateJs.isDefined(v) && !validateJs.isEmpty(v);

    if (checkValue(value)) {
      return true;
    }

    for (const k of Object.keys(this.attributes)) {
      if (checkValue(this.attributes[k])) {
        return true;
      }
    }
    return false;
  }
}

export default (value: any, opts: any, key: string, attributes: object): ValidationResult =>
  (new AnyOf(opts, key, attributes).validate(value));
