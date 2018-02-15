import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class Defined extends Validator {
  constructor(opts: any) {
    if (opts === true || opts === false) {
      opts = {isDefined: opts};
    }
    if (!('message' in opts)) {
      if (opts.isDefined) {
        opts.message = 'must be defined';
      } else {
        opts.message = 'cannot be defined';
      }
    }
    super('isDefined', opts);
  }

  public test(value: any): boolean {
    return validateJs.isDefined(value) === this.opts.isDefined;
  }
}

export default (value: any, opts: any): ValidationResult =>
  (new Defined(opts).validate(value));
