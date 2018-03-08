import { Context, RequestArgs } from '@syncano/core';
import has from 'lodash.has';
import { IValidatorOpts, Validator } from './validator';

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
