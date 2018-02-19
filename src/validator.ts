import {sprintf} from 'sprintf-js';

export interface IValidationError {
  [s: string]: string;
}

export interface IAttribs {
  [s: string]: any;
}

export type ValidationResult = (IValidationError|undefined);
export interface IValidator {
  message(value: any): string;
  test(value: any): boolean;
  validate(value: any): ValidationResult;
}

export abstract class Validator {
  protected attributes: IAttribs;
  private msg: string;
  constructor(public validatorName: string,
              public opts: any,
              public key: string,
              attributes: object) {
    this.attributes = attributes;
    this.msg = opts.message || 'bad value %(value)s';
  }
  public message(value: any): string {
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
