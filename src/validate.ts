import Server, { Context } from '@syncano/core';
import {HandlerFn,
  IResponse,
  IResponsePayload,
  IResponseStatus,
  NamedResponse,
  response,
} from 'syncano-middleware';
import { Constraints } from './constraints';
import { MetaParser } from './meta_parser';
import { NamedMetaParser } from './socket_info_parser';
import { ValidationResult } from './validate';

export class ValidatePlugin {
  constructor(private handler: HandlerFn,
              private endpointMeta: Constraints) {}
  public async handle(ctx: Context,
                      syncano: Server): Promise<IResponse|IResponsePayload|IResponseStatus|NamedResponse> {
    const validationResult = this.endpointMeta.test(ctx.args || {});
    if (validationResult) {
      return response(validationResult, 400);
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
                              Promise<Constraints> {
  return namedMetaParser.getMeta(ctx, endpointName);
}

export default (handler: HandlerFn): HandlerFn =>
  (ctx: Context, syncano: Server): Promise<IResponse|IResponsePayload|IResponseStatus|NamedResponse> =>
      makeValidator(ctx, handler)
      .then(validator => validator.handle(ctx, syncano));

export async function validateByEndpointName( args: any,
                                              ctx: Context,
                                              endpointName: string):
                                              Promise<ValidationResult> {
  return makeNamedValidator(ctx, endpointName)
      .then(constraints => constraints.test(args));
}

export { validators } from './validators';
export { ValidationResult } from './validator';
