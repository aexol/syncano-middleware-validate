import { IHandler, IResponse, IResponsePayload, IResponseStatus, ISyncanoContext } from 'syncano-middleware';
export declare class ValidatePlugin {
    private handler;
    rules: object | undefined;
    constructor(handler: IHandler, rules?: object | undefined);
    handle(ctx: ISyncanoContext, syncano: object): Promise<IResponse | IResponsePayload | IResponseStatus>;
}
declare const _default: (handler: IHandler, rules?: object | undefined) => IHandler;
export default _default;
