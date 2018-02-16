import Server, { Context } from '@syncano/core';
import { HandlerFn, IResponse, IResponsePayload, IResponseStatus, NamedResponse } from 'syncano-middleware';
import { IConstraints } from './constraints';
export declare class ValidatePlugin {
    private handler;
    private endpointMeta;
    constructor(handler: HandlerFn, endpointMeta: IConstraints);
    handle(ctx: Context, syncano: Server): Promise<IResponse | IResponsePayload | IResponseStatus | NamedResponse>;
}
declare const _default: (handler: HandlerFn) => HandlerFn;
export default _default;
