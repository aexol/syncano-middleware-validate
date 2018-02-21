import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class AllOf extends Validator {
  private allOf: string[];
  constructor(opts: any, key: string, attributes: object) {
    if (typeof opts !== 'object' || Array.isArray(opts)) {
      opts = {parameters: opts};
    }
    if (!('message' in opts)) {
      opts.message = 'all of %(parameters)s are required';
    }
    super('allOf', opts, key, attributes);
    this.allOf = [];
    const params = opts.parameters;
    if (Array.isArray(params)) {
      const aOpts: any[] = params;
      for (const i in params) {
        if (typeof params[i] === 'string') {
          this.allOf.push(params[i]);
        }
      }
    }
  }

  public async test(value: any): Promise<boolean> {
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

export default (value: any, opts: any, key: string, attributes: object): Promise<ValidationResult> =>
  (new AllOf(opts, key, attributes).validate(value));
