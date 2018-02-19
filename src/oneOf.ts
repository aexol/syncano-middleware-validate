import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class OneOf extends Validator {
  private oneOf: string[];
  constructor(opts: any, key: string, attributes: object) {
    if (typeof opts !== 'object' || Array.isArray(opts)) {
      opts = {parameters: opts};
    }
    if (!('message' in opts)) {
      opts.message = 'exactly one of %(parameters)s is required';
    }
    super('oneOf', opts, key, attributes);
    this.oneOf = [];
    const params = opts.parameters;
    if (Array.isArray(params)) {
      const aOpts: any[] = params;
      for (const i in params) {
        if (typeof params[i] === 'string') {
          this.oneOf.push(params[i]);
        }
      }
    }
  }

  public test(value: any): boolean {
    const checkValue = (v: any) =>
      validateJs.isDefined(v) && !validateJs.isEmpty(v);
    let count: number = 0;
    for (const k of Object.keys(this.attributes)) {
      if (checkValue(this.attributes[k])) {
        count++;
      }
      if (count > 1) {
        break;
      }
    }
    return count === 1;
  }
}

export default (value: any, opts: any, key: string, attributes: object): ValidationResult =>
  (new OneOf(opts, key, attributes).validate(value));
