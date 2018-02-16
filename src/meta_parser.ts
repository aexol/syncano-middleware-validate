import { Context, RequestMetaMetadata } from '@syncano/core';
import get from 'lodash.get';
import { Constraints, IConstraints } from './constraints';

export class MetaParser {
  private constraints?: IConstraints;
  public async getMeta(ctx: Context): Promise<IConstraints> {
    const metadata = get(ctx, 'meta.metadata', {});
    if (!this.constraints) {
      this.constraints = new Constraints(metadata);
    }
    return this.constraints;
  }
}
