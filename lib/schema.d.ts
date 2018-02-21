import { Context } from '@syncano/core';
import { IValidationError, Validator } from './validator';
export declare class Schema extends Validator {
    private ajv;
    private paramId;
    private name;
    private ctx?;
    constructor(opts: any, key: string, attributes: object, globalOptions?: object);
    test(value: any, ctx?: Context): boolean;
    private makeId(schemaId);
    private makeSchema();
    private getSchema();
}
declare const _default: (value: any, opts: any, key: string, attributes: object, globalOptions?: object | undefined) => IValidationError | undefined;
export default _default;
