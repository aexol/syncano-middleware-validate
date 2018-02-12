import {IHandler, IResponse, IResponsePayload, IResponseStatus, ISyncanoContext} from 'syncano-middleware';
import {validate} from 'syncano-validate';
export class ValidatePlugin {
  constructor(private handler: IHandler, public rules?: object) {}
  public handle(ctx: ISyncanoContext, syncano: object): Promise<IResponse|IResponsePayload|IResponseStatus> {

    return validate(ctx.args, this.rules).then(() => this.handler(ctx, syncano));
  }
}

export default (handler: IHandler, rules?: object): IHandler => {
  return (ctx: ISyncanoContext, syncano: object): Promise<IResponse|IResponsePayload|IResponseStatus> => {
    const validator = new ValidatePlugin(handler, rules);
    return validator.handle(ctx, syncano);
  };
};
