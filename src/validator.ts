import { Context } from '@syncano/core';
import {ErrorObject} from 'ajv';
import {sprintf} from 'sprintf-js';
export {ErrorObject} from 'ajv';

export interface IValidationError {
  [s: string]: string;
}

export interface IAttribs {
  [s: string]: any;
}

export interface IOptions {
  [s: string]: any;
}

export type ValidationResult = (IValidationError|ErrorObject[]|undefined);
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
  public message(value: any): (string|undefined) {
    if ( typeof this.msg !== 'string' ) {
      return;
    }
    return sprintf(this.msg, {
      attributes: this.attributes,
      key: this.key,
      validatorName: this.validatorName,
      value,
      ...this.opts});
  }
  public async validate(value: any): Promise<ValidationResult> {
    return this.test(value, (this.globalOptions || {}).ctx )
        .then((valid: boolean) => {
          if (valid) {
            return undefined;
          }
          if (Array.isArray(this.msg)) {
            return this.msg;
          }
          return {[this.validatorName]: this.message(value) || 'unkown validation error'};
        });
  }
  public abstract test(value: any, ctx?: Context): Promise<boolean>;
}
