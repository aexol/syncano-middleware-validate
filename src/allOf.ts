import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class AllOf extends Validator {
  private allOf: string[];
  constructor(opts: any, key: string, attributes: object) {
    if (typeof opts !== 'object') {
      opts.parameters = opts;
    }
    if (!('message' in opts)) {
      opts.message = 'all of %(parameters)s are required';
    }
    super('allOf', opts, key, attributes);
    this.allOf = [];
    if (Array.isArray(opts.parameters)) {
      const aOpts: any[] = opts;
      for (const i in opts) {
        if (typeof opts[i] === 'string') {
          this.allOf.push(opts[i]);
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
    }
    return count === this.opts.parameters.length;
  }
}

export default (value: any, opts: any, key: string, attributes: object): ValidationResult =>
  (new AllOf(opts, key, attributes).validate(value));
