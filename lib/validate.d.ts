import { HandlerFn, IResponse, IResponsePayload, IResponseStatus, ISyncanoContext } from 'syncano-middleware';
import { IConstraints } from './constraints';
export declare class ValidatePlugin {
    private handler;
    private endpointMeta;
    constructor(handler: HandlerFn, endpointMeta: IConstraints);
    handle(ctx: ISyncanoContext, syncano: object): Promise<IResponse | IResponsePayload | IResponseStatus>;
}
declare const _default: (handler: HandlerFn) => HandlerFn;
export default _default;
