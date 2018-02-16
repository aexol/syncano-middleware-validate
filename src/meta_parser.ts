import { Context, RequestMetaMetadata } from '@syncano/core';
import get from 'lodash.get';
import { Constraints } from './constraints';

export class MetaParser {
  private constraints?: Constraints;
  public async getMeta(ctx: Context): Promise<Constraints> {
    const metadata = get(ctx, 'meta.metadata', {});
    if (!this.constraints) {
      this.constraints = new Constraints(metadata);
    }
    return this.constraints;
  }
}
