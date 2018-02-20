import { Context } from '@syncano/core';
import { ErrorObject } from 'ajv';
export interface IValidationError {
    [s: string]: (string | ErrorObject[]);
}
export interface IAttribs {
    [s: string]: any;
}
export declare type ValidationResult = (IValidationError | undefined);
export interface IValidator {
    message(value: any): (string | ErrorObject[]);
    test(value: any, ctx?: Context): boolean;
    validate(value: any): ValidationResult;
}
export declare abstract class Validator {
    validatorName: string;
    opts: any;
    key: string;
    msg: (string | ErrorObject[]);
    protected attributes: IAttribs;
    constructor(validatorName: string, opts: any, key: string, attributes: object);
    message(value: any): (string | ErrorObject[]);
    validate(value: any, ctx?: Context): ValidationResult;
    abstract test(value: any, ctx?: Context): boolean;
}
