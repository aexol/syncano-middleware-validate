import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class Match extends Validator {
  constructor(opts: any) {
    if (typeof opts === 'string') {
      opts = {pattern: opts};
    }
    if (!('message' in opts)) {
      opts.message = '$(value)s must match $(pattern)s';
    }
    super('match', opts);
  }

  public test(value: any): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    return (value as string).match(this.opts.pattern) !== null;
  }
}

export default (value: any, opts: any): ValidationResult =>
  (new Match(opts).validate(value));
