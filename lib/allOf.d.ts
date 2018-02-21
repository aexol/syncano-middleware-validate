import { IValidationError, Validator } from './validator';
export declare class AllOf extends Validator {
    private allOf;
    constructor(opts: any, key: string, attributes: object);
    test(value: any): Promise<boolean>;
}
declare const _default: (value: any, opts: any, key: string, attributes: object) => Promise<IValidationError | undefined>;
export default _default;
