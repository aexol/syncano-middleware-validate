import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class AnyOf extends Validator {
  private anyOf: string[];
  constructor(opts: any, key: string, attributes: object) {
    if (typeof opts !== 'object' || Array.isArray(opts)) {
      opts = {parameters: opts};
    }
    if (!('message' in opts)) {
      opts.message = 'atleast one of %(parameters)s is required';
    }
    super('anyOf', opts, key, attributes);
    this.anyOf = [];
    const params = opts.parameters;
    if (Array.isArray(params)) {
      const aOpts: any[] = params;
      for (const i in params) {
        if (typeof params[i] === 'string') {
          this.anyOf.push(params[i]);
        }
      }
    }
  }

  public async test(value: any): Promise<boolean> {
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

export default (value: any, opts: any, key: string, attributes: object): Promise<ValidationResult> =>
  (new AnyOf(opts, key, attributes).validate(value));
