import {sprintf} from 'sprintf-js';

export interface IValidationError {
  [s: string]: string;
}
export type ValidationResult = (IValidationError|undefined);
export interface IValidator {
  message(value: any): string;
  test(value: any): boolean;
  validate(value: any): ValidationResult;
}

export abstract class Validator {
  private msg: string;
  constructor(public validatorName: string,
              public opts: any,
              public key: string,
              public attributes: object) {
    this.msg = opts.message ?
    opts.message : 'bad value %(value)s';
  }
  public message(value: any): string {
    console.log(this.msg);
    console.log(this.validatorName);
    console.log(value);
    return sprintf(this.msg, {
      attributes: this.attributes,
      key: this.key,
      validatorName: this.validatorName,
      value,
      ...this.opts});
  }
  public validate(value: any): ValidationResult {
    if (this.test(value)) {
      return undefined;
    }
    return {[this.validatorName]: this.message(value)};
  }
  public abstract test(value: any): boolean;
}
