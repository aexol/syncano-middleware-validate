import {HandlerFn,
  IResponse,
  IResponsePayload,
  IResponseStatus,
  NamedResponse,
  response,
} from '@aexol/syncano-middleware';
import Server, { Context } from '@syncano/core';
import { Constraints } from './constraints';
import { MetaParser } from './meta_parser';
import { IConstraintsWithContext, NamedMetaParser } from './socket_info_parser';
import { ValidationResult } from './validator';

export class ValidatePlugin {
  constructor(private handler: HandlerFn,
              private endpointMeta: Constraints) {}
  public async handle(ctx: Context,
                      syncano: Server): Promise<IResponse|IResponsePayload|IResponseStatus|NamedResponse> {
    let c: Promise<any>;
    try {
      c = await this.endpointMeta.test(ctx.args || {},
                                    ctx,
                                    syncano);
    } catch (e) {
      return response(e, 400);
    }
    return this.handler(ctx, syncano);
  }
}

const metaParser = new MetaParser();
async function makeValidator( ctx: Context,
                              handler: HandlerFn): Promise<ValidatePlugin> {
  return metaParser
    .getMeta(ctx)
    .then(endpointMeta => new ValidatePlugin(handler, endpointMeta));
}

const namedMetaParser = new NamedMetaParser();
async function makeNamedValidator( ctx: Context, endpointName: string ):
                              Promise<IConstraintsWithContext> {
  return namedMetaParser.getMeta(ctx, endpointName);
}

export default (handler: HandlerFn): HandlerFn =>
  (ctx: Context, syncano: Server): Promise<IResponse|IResponsePayload|IResponseStatus|NamedResponse> =>
      makeValidator(ctx, handler)
      .then(validator => validator.handle(ctx, syncano));

export async function validateByEndpointName( args: any,
                                              ctx: Context,
                                              endpointName: string,
                                              syncano?: Server):
                                              Promise<ValidationResult> {
  return makeNamedValidator(ctx, endpointName)
      .then(v => v.constraints.test(args, v.context, syncano));
}

export { validators } from './validators';
export { ValidationResult } from './validator';
