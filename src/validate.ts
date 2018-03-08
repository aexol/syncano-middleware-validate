import {HandlerFn, HandlerReturn, response} from '@aexol/syncano-middleware';
import Server, { Context } from '@syncano/core';
import { InputValidator } from './inputs';

export default (handler: HandlerFn) =>
  async (ctx: Context, syncano: Server): Promise<HandlerReturn> => {
    const schema = new InputValidator(ctx, {ctx, syncano});
    try {
      await schema.validate(ctx.args || {});
    } catch (e) {
      return response(e, 400);
    }
    return handler(ctx, syncano);
  };

export {SchemaBuilder} from './schema';
export {InputValidator} from './inputs';
