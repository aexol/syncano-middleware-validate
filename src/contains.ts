import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class Contains extends Validator {
  constructor(opts: any) {
    if (Array.isArray(opts)) {
      opts = {collection: opts};
    }
    if (!('message' in opts)) {
      opts.message = 'collection $(coollection)s does not contain $(value)s';
    }
    super('contains', opts);
  }

  public test(value: any): boolean {
    return validateJs.contains(this.opts.collection, value);
  }
}

export default (value: any, opts: any): ValidationResult =>
  (new Contains(opts).validate(value));
