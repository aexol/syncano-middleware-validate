import Syncano from '@syncano/core';
import { ISyncanoContext } from 'syncano-middleware';
import { Constraints, IConstraints } from './constraints';

export class MetaParser {
  private constraints?: IConstraints;
  public async getMeta(ctx: ISyncanoContext): Promise<IConstraints> {
    if (!this.constraints) {
      this.constraints = new Constraints(ctx.meta.metadata);
    }
    return this.constraints;
  }
}
