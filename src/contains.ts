import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class Contains extends Validator {
  constructor(opts: any, key: string, attributes: object) {
    if (Array.isArray(opts)) {
      opts = {collection: opts};
    }
    if (!('message' in opts)) {
      opts.message = 'collection %(coollection)s does not contain %(value)s';
    }
    super('contains', opts, key, attributes);
  }

  public test(value: any): boolean {
    return !validateJs.isDefined(value) || validateJs.contains(this.opts.collection, value);
  }
}

export default (value: any, opts: any, key: string, attributes: object): ValidationResult =>
  (new Contains(opts, key, attributes).validate(value));
