import { Context } from '@syncano/core';
import { ErrorObject } from 'ajv';
export interface IValidationError {
    [s: string]: (string | ErrorObject[]);
}
export interface IAttribs {
    [s: string]: any;
}
export interface IOptions {
    [s: string]: any;
}
export declare type ValidationResult = (IValidationError | undefined);
export interface IValidator {
    message(value: any): (string | ErrorObject[]);
    test(value: any): boolean;
    validate(value: any): ValidationResult;
}
export declare abstract class Validator {
    validatorName: string;
    opts: any;
    key: string;
    globalOptions: IOptions | undefined;
    msg: (string | ErrorObject[]);
    protected attributes: IAttribs;
    constructor(validatorName: string, opts: any, key: string, attributes: object, globalOptions?: IOptions | undefined);
    message(value: any): (string | ErrorObject[]);
    validate(value: any): Promise<ValidationResult>;
    abstract test(value: any, ctx?: Context): Promise<boolean>;
}
