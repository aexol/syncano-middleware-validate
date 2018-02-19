import { IValidationError, Validator } from './validator';
export declare class OneOf extends Validator {
    private oneOf;
    constructor(opts: any, key: string, attributes: object);
    test(value: any): boolean;
}
declare const _default: (value: any, opts: any, key: string, attributes: object) => IValidationError | undefined;
export default _default;
