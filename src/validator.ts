import { Context } from '@syncano/core';
import {ErrorObject} from 'ajv';
import {sprintf} from 'sprintf-js';

export interface IValidationError {
  [s: string]: (string|ErrorObject[]);
}

export interface IAttribs {
  [s: string]: any;
}

export interface IOptions {
  [s: string]: any;
}

export type ValidationResult = (IValidationError|undefined);
export interface IValidator {
  message(value: any): (string|ErrorObject[]);
  test(value: any): boolean;
  validate(value: any): ValidationResult;
}

export abstract class Validator {
  public msg: (string|ErrorObject[]);
  protected attributes: IAttribs;
  constructor(public validatorName: string,
              public opts: any,
              public key: string,
              attributes: object,
              public globalOptions?: IOptions) {
    this.attributes = attributes;
    this.msg = opts.message || 'bad value %(value)s';
  }
  public message(value: any): (string|ErrorObject[]) {
    if ( typeof this.msg !== 'string' ) {
      return this.msg;
    }
    return sprintf(this.msg, {
      attributes: this.attributes,
      key: this.key,
      validatorName: this.validatorName,
      value,
      ...this.opts});
  }
  public validate(value: any): ValidationResult {
    if (this.test(value, (this.globalOptions || {}).ctx )) {
      return undefined;
    }
    return {[this.validatorName]: this.message(value)};
  }
  public abstract test(value: any, ctx?: Context): boolean;
}
