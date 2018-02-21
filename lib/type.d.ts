import { Context } from '@syncano/core';
import { IValidationError, Validator } from './validator';
export declare class Type extends Validator {
    constructor(opts: any, key: string, attributes: object);
    test(value: any, ctx?: Context): Promise<boolean>;
}
declare const _default: (value: any, opts: any, key: string, attributes: object) => Promise<IValidationError | undefined>;
export default _default;
