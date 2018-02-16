import Server, { Context } from '@syncano/core';
import {HandlerFn, IResponse, IResponsePayload, IResponseStatus} from 'syncano-middleware';
import { IConstraints } from './constraints';
import { MetaParser } from './meta_parser';
import validators from './validators';

export class ValidatePlugin {
  constructor(private handler: HandlerFn,
              private endpointMeta: IConstraints) {}
  public async handle(ctx: Context,
                      syncano: Server): Promise<IResponse|IResponsePayload|IResponseStatus> {
    const validationResult = this.endpointMeta.test(ctx.args || {}, validators);
    if (validationResult) {
      throw validationResult;
    }
    return this.handler(ctx, syncano);
  }
}

async function makeValidator( ctx: Context,
                              handler: HandlerFn): Promise<ValidatePlugin> {
  return new MetaParser()
    .getMeta(ctx)
    .then(endpointMeta => new ValidatePlugin(handler, endpointMeta));
}

export default (handler: HandlerFn): HandlerFn =>
  (ctx: Context, syncano: Server): Promise<IResponse|IResponsePayload|IResponseStatus> =>
      makeValidator(ctx, handler)
      .then(validator => validator.handle(ctx, syncano));
