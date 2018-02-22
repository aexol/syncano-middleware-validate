import { Context } from '@syncano/core';
import { IValidationError, Validator } from './validator';
export declare function interpolateDeep(o: any, opts?: any): Promise<any>;
export declare class Schema extends Validator {
    private ajv;
    private paramId;
    private name;
    private socket;
    private endpoint;
    private parameter;
    private ctx?;
    private syncano?;
    constructor(opts: any, key: string, attributes: object, globalOptions?: object);
    test(value: any, ctx?: Context): Promise<boolean>;
    private makeId(schemaId);
    private fetchSocketJSON();
    private makeSocketSchema();
    private makeEndpointSchema();
    private makeSchema();
    private getSchema();
}
declare const _default: (value: any, opts: any, key: string, attributes: object, globalOptions?: object | undefined) => Promise<IValidationError | undefined>;
export default _default;
