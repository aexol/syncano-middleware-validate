import { Context, RequestArgs } from '@syncano/core';
import get from 'lodash.get';
import has from 'lodash.has';
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

export class InputValidator extends Validator {
  constructor(ctx: Context, opts?: IValidatorOpts) {
    super(ctx, opts);
  }
  public async validate(args: RequestArgs): Promise<boolean> {
    const validate = await this.schema.getSchema(this.ref);
    const valid = await validate(args);
    if (!valid) {
      throw validate.errors;
    }
    return valid;
  }

  protected get ref() {
    let ref = 'inputs';
    if (has(this, `ctx.meta.metadata.inputs.${this.method}`)) {
      ref = `${ref}/${this.method}`;
    }
    return ref;
  }
}
