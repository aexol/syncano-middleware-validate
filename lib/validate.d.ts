import Server, { Context } from '@syncano/core';
import { HandlerFn, IResponse, IResponsePayload, IResponseStatus, NamedResponse } from 'syncano-middleware';
import { Constraints } from './constraints';
import { ValidationResult } from './validate';
export declare class ValidatePlugin {
    private handler;
    private endpointMeta;
    constructor(handler: HandlerFn, endpointMeta: Constraints);
    handle(ctx: Context, syncano: Server): Promise<IResponse | IResponsePayload | IResponseStatus | NamedResponse>;
}
declare const _default: (handler: HandlerFn) => HandlerFn;
export default _default;
export declare function validateByEndpointName(args: any, ctx: Context, endpointName: string): Promise<ValidationResult>;
export { validators } from './validators';
export { ValidationResult } from './validator';
