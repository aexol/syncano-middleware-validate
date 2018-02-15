import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class Empty extends Validator {
  constructor(opts: any) {
    if (opts === true || opts === false) {
      opts = {isEmpty: opts};
    }
    if (!('message' in opts)) {
      if (opts.isEmpty) {
        opts.message = 'must be empty';
      } else {
        opts.message = 'cannot be empty';
      }
    }
    super('isEmpty', opts);
  }

  public test(value: any): boolean {
    return validateJs.isEmpty(value) === this.opts.isEmpty;
  }
}

export default (value: any, opts: any): ValidationResult =>
  (new Empty(opts).validate(value));
