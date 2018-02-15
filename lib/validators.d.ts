import { ValidationResult } from './validator';
export declare type ValidationFn = (value: any, options: any) => ValidationResult;
export interface IValidators {
    contains: ValidationFn;
    cleanAttributes: (attributes: any, whitelist: any) => any;
    datetime: ValidationFn;
    defined: ValidationFn;
    email: ValidationFn;
    empty: ValidationFn;
    equality: ValidationFn;
    exclusion: ValidationFn;
    inclusion: ValidationFn;
    length: ValidationFn;
    match: ValidationFn;
    numericality: ValidationFn;
    presence: ValidationFn;
    required: ValidationFn;
    type: ValidationFn;
    url: ValidationFn;
    [s: string]: ValidationFn;
}
export declare class Validators implements IValidators {
    contains(values: any, options: any): ValidationResult;
    cleanAttributes(values: any, options: any): any;
    datetime(values: any, options: any): ValidationResult;
    defined(values: any, options: any): ValidationResult;
    email(values: any, options: any): ValidationResult;
    empty(values: any, options: any): ValidationResult;
    equality(values: any, options: any): ValidationResult;
    exclusion(values: any, options: any): ValidationResult;
    inclusion(values: any, options: any): ValidationResult;
    length(values: any, options: any): ValidationResult;
    match(values: any, options: any): ValidationResult;
    numericality(values: any, options: any): ValidationResult;
    presence(values: any, options: any): ValidationResult;
    required(values: any, options: any): ValidationResult;
    type(values: any, options: any): ValidationResult;
    url(values: any, options: any): ValidationResult;
    [s: string]: ValidationFn;
}
declare const _default: Validators;
export default _default;
