import validateJs from 'validate.js';
import {IValidationError, ValidationResult, Validator} from './validator';

export class Match extends Validator {
  constructor(opts: any, key: string, attribtues: object) {
    if (typeof opts === 'string') {
      opts = {pattern: opts};
    }
    if (!('message' in opts)) {
      opts.message = '%(key)s must match %(pattern)s';
    }
    super('match', opts, key, attribtues);
  }

  public async test(value: any): Promise<boolean> {
    if (!validateJs.isDefined(value)) {
      return true;
    }
    if (typeof value !== 'string') {
      return false;
    }
    return (value as string).match(this.opts.pattern) !== null;
  }
}

export default (value: any, opts: any, key: string, attributes: object): Promise<ValidationResult> =>
  (new Match(opts, key, attributes).validate(value));
