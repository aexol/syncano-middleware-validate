import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class Empty extends Validator {
  constructor(opts: any, key: string, attribtues: object) {
    if (opts === true || opts === false) {
      opts = {isEmpty: opts};
    }
    if (!('message' in opts)) {
      if (opts.isEmpty) {
        opts.message = '%(key)s must be empty';
      } else {
        opts.message = '%(key)s cannot be empty';
      }
    }
    super('isEmpty', opts, key, attribtues);
  }

  public test(value: any): boolean {
    return validateJs.isEmpty(value) === this.opts.isEmpty;
  }
}

export default (value: any, opts: any, key: string, attributes: object): ValidationResult =>
  (new Empty(opts, key, attributes).validate(value));
