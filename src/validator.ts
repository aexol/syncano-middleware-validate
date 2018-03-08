import { Context } from '@syncano/core';
import get from 'lodash.get';
import { ISchemaOpts, SchemaBuilder } from './schema';

export interface IValidatorOpts extends ISchemaOpts {
  schema?: SchemaBuilder;
}

export class Validator {
  public schema: SchemaBuilder;
  constructor(public ctx: Context, opts: IValidatorOpts = {ctx}) {
    this.schema = opts.schema || new SchemaBuilder(opts);
  }
  protected get method() {
    return get(this, 'ctx.meta.request.REQUEST_METHOD', '*');
  }
}
