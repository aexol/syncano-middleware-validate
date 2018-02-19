import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class OneOf extends Validator {
  private oneOf: string[];
  constructor(opts: any, key: string, attributes: object) {
    if (typeof opts !== 'object') {
      opts.parameters = opts;
    }
    if (!('message' in opts)) {
      opts.message = 'exactly one of %(parameters)s is required';
    }
    super('oneOf', opts, key, attributes);
    this.oneOf = [];
    if (Array.isArray(opts.parameters)) {
      const aOpts: any[] = opts;
      for (const i in opts) {
        if (typeof opts[i] === 'string') {
          this.oneOf.push(opts[i]);
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
