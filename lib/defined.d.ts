import { IValidationError, Validator } from './validator';
export declare class Defined extends Validator {
    constructor(opts: any);
    test(value: any): boolean;
}
declare const _default: (value: any, opts: any) => IValidationError | undefined;
export default _default;