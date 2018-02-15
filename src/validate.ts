import {HandlerFn, IResponse, IResponsePayload, IResponseStatus, ISyncanoContext} from 'syncano-middleware';
import { IConstraints } from './constraints';
import { MetaParser } from './meta_parser';
import validators from './validators';

export class ValidatePlugin {
  constructor(private handler: HandlerFn,
              private endpointMeta: IConstraints) {}
  public async handle(ctx: ISyncanoContext,
                      syncano: object): Promise<IResponse|IResponsePayload|IResponseStatus> {
    const validationResult = this.endpointMeta.test(ctx.args, validators);
    if (validationResult) {
      throw validationResult;
    }
    return this.handler(ctx, syncano);
  }
}

async function makeValidator( ctx: ISyncanoContext,
                              handler: HandlerFn): Promise<ValidatePlugin> {
  return new MetaParser()
    .getMeta(ctx)
    .then(endpointMeta => new ValidatePlugin(handler, endpointMeta));
}

export default (handler: HandlerFn): HandlerFn =>
  (ctx: ISyncanoContext, syncano: object): Promise<IResponse|IResponsePayload|IResponseStatus> =>
      makeValidator(ctx, handler)
      .then(validator => validator.handle(ctx, syncano));
