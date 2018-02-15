import { ISyncanoEndpoint } from './syncano_endpoint';
import { IValidationError } from './validator';
import { IValidators } from './validators';
export interface IAttributes {
    [s: string]: any;
}
export interface IConstraint {
    contains?: (any[] | object);
    cleanAttributes?: string[];
    datetime?: object;
    defined?: (boolean | object);
    email?: (boolean | object);
    equality?: (string | object);
    exclusion?: (any[] | object);
    inclusion?: (any[] | object);
    length?: object;
    match?: (string | object);
    numericality?: (boolean | object);
    presence?: (boolean | object);
    required?: (boolean | object);
    type?: (string | object);
    url?: (boolean | object);
}
export interface IRule {
    rule: string;
    options: any;
}
export interface IRules {
    rules(): IRule[];
}
export interface IConstraintsList {
    [param: string]: IRules & IConstraint;
}
export declare type ValidationResults = IValidationError[] | undefined;
export interface IConstraints {
    constraints: IConstraintsList;
    test(args: IAttributes, validators: IValidators): ValidationResults;
}
export interface IRawConstraint {
    [param: string]: object;
}
export interface IRawConstraints {
    [param: string]: IRawConstraint;
}
export declare class Constraints implements IConstraints {
    constraints: IConstraintsList;
    constructor(endpoint: ISyncanoEndpoint);
    test(args: IAttributes, validators: IValidators): ValidationResults;
}
