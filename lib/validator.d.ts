export interface IValidationError {
    [s: string]: string;
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
    private msg;
    constructor(validatorName: string, opts: any);
    message(value: any): string;
    validate(value: any): ValidationResult;
    abstract test(value: any): boolean;
}
