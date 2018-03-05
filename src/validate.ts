import {HandlerFn, HandlerReturn, response} from '@aexol/syncano-middleware';
import Server, { Context } from '@syncano/core';
import { Schema } from './schema';

export default (handler: HandlerFn) =>
  async (ctx: Context, syncano: Server): Promise<HandlerReturn> => {
    const schema = new Schema({ctx, syncano});
    try {
      await schema.validate(ctx.args || {});
    } catch (e) {
      return response(e, 400);
    }
    return handler(ctx, syncano);
  };

export {Schema} from './schema';
