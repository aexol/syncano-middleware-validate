import { IValidationError, Validator } from './validator';
export declare class Contains extends Validator {
    constructor(opts: any, key: string, attributes: object);
    test(value: any): Promise<boolean>;
}
declare const _default: (value: any, opts: any, key: string, attributes: object) => Promise<IValidationError | undefined>;
export default _default;
