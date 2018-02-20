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

async function makeValidator( ctx: Context,
                              handler: HandlerFn): Promise<ValidatePlugin> {
  return new MetaParser()
    .getMeta(ctx)
    .then(endpointMeta => new ValidatePlugin(handler, endpointMeta));
}

export default (handler: HandlerFn): HandlerFn =>
  (ctx: Context, syncano: Server): Promise<IResponse|IResponsePayload|IResponseStatus|NamedResponse> =>
      makeValidator(ctx, handler)
      .then(validator => validator.handle(ctx, syncano));

import _validators from './validators';
export const validators = _validators;
export { ValidationResult } from './validator';
