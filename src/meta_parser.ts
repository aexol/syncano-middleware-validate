import { Context, RequestMetaMetadata, RequestMetaRequest } from '@syncano/core';
import find from 'lodash.find';
import get from 'lodash.get';
import set from 'lodash.set';
import { Constraints } from './constraints';

export class MetaParser {
  private constraints?: Constraints;
  private getConstraints?: Constraints;
  private postConstraints?: Constraints;
  private putConstraints?: Constraints;
  private deleteConstraints?: Constraints;
  public async getMeta(ctx: Context): Promise<Constraints> {
    if (!this.sconstraints(ctx)) {
      this.makeConstraints(ctx);
    }
    return this.sconstraints(ctx) as Constraints;
  }

  private getMetadata(ctx: Context): RequestMetaMetadata {
    return get(ctx, 'meta.metadata', {});
  }

  private getMetaRequest(ctx: Context): RequestMetaRequest {
    return get(ctx, 'meta.request', {});
  }

  private makeConstraints(ctx: Context) {
    const metadata = this.getMetadata(ctx);
    const constraints =  new Constraints(this.patchMeta(ctx));
    const method = this.getMethod(ctx);
    const setTarget = method ?
          method.toLowerCase() + 'Constraints' : 'constraints';
    set(this, setTarget, constraints);
  }

  private patchMeta(ctx: Context): RequestMetaMetadata {
    const metadata = this.getMetadata(ctx);
    if (!metadata.constraints) {
      return metadata;
    }
    const method = this.getMethod(ctx);
    const constraints =  method ? get(metadata.constraints,
                        method.toLowerCase(),
                        metadata.constraints) : metadata.constraints;

    return {...metadata, constraints};
  }

  private sconstraints(ctx: Context): (Constraints|undefined) {
    const method = this.getMethod(ctx);
    if (!method) {
      return this.constraints;
    }
    return get(this,
              method.toLowerCase() + 'Constraints',
            this.constraints);
  }

  private getMethod(ctx: Context): (string|undefined) {
    const method = this.getMetaRequest(ctx).REQUEST_METHOD;
    return find([
      'DELETE',
      'GET',
      'POST',
      'PUT',
    ], v => v === method);
  }
}
