import {IHandler, IResponse, IResponsePayload, IResponseStatus, ISyncanoContext} from 'syncano-middleware';
import {validate} from 'syncano-validate';
export class ValidatePlugin {
  constructor(private handler: IHandler, public rules?: object) {}
  public handle(ctx: ISyncanoContext, syncano: object): Promise<IResponse|IResponsePayload|IResponseStatus> {

    return validate(ctx.args, this.rules).catch((e: Error): void => {
      throw {
        payload: e,
        status: 400,
      };
    }).then(() => this.handler(ctx, syncano));
  }
}

export default (handler: IHandler, rules?: object): IHandler =>
  (ctx: ISyncanoContext, syncano: object): Promise<IResponse|IResponsePayload|IResponseStatus> =>
    (new ValidatePlugin(handler, rules)).handle(ctx, syncano);
