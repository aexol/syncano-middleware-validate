import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class Defined extends Validator {
  constructor(opts: any, key: string, attributes: object) {
    if (opts === true || opts === false) {
      opts = {isDefined: opts};
    }
    if (!('message' in opts)) {
      if (opts.isDefined) {
        opts.message = '%(key) must be defined';
      } else {
        opts.message = '%(key) cannot be defined';
      }
    }
    super('isDefined', opts, key, attributes);
  }

  public async test(value: any): Promise<boolean> {
    return validateJs.isDefined(value) === this.opts.isDefined;
  }
}

export default (value: any, opts: any, key: string, attributes: object): Promise<ValidationResult> =>
  (new Defined(opts, key, attributes).validate(value));
