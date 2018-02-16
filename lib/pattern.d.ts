import { IValidationError, Validator } from './validator';
export declare class Match extends Validator {
    constructor(opts: any, key: string, attribtues: object);
    test(value: any): boolean;
}
declare const _default: (value: any, opts: any, key: string, attributes: object) => IValidationError | undefined;
export default _default;
