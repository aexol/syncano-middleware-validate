export interface IValidationError {
    [s: string]: string;
}
export interface IAttribs {
    [s: string]: any;
}
export declare type ValidationResult = (IValidationError | undefined);
export interface IValidator {
    message(value: any): string;
    test(value: any): boolean;
    validate(value: any): ValidationResult;
}
export declare abstract class Validator {
    validatorName: string;
    opts: any;
    key: string;
    protected attributes: IAttribs;
    private msg;
    constructor(validatorName: string, opts: any, key: string, attributes: object);
    message(value: any): string;
    validate(value: any): ValidationResult;
    abstract test(value: any): boolean;
}
