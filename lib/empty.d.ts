import { IValidationError, Validator } from './validator';
export declare class Empty extends Validator {
    constructor(opts: any, key: string, attribtues: object);
    test(value: any): Promise<boolean>;
}
declare const _default: (value: any, opts: any, key: string, attributes: object) => Promise<IValidationError | undefined>;
export default _default;
