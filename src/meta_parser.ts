import Server, { Context, RequestMetaMetadata, RequestMetaRequest } from '@syncano/core';
import get from 'lodash.get';
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
    if (metadata.constraint) {
      switch (this.getMetaRequest(ctx).REQUEST_METHOD) {
        case 'GET':
          if ( metadata.constraints.get) {
            this.getConstraints = constraints;
            return;
          }
          break;
        case 'POST':
          if ( metadata.constraints.post) {
            this.postConstraints = constraints;
            return;
          }
          break;
        case 'PUT':
          if ( metadata.constraints.put) {
            this.putConstraints = constraints;
            return;
          }
          break;
        case 'DELETE':
          if ( metadata.constraints.delete ) {
            this.deleteConstraints = constraints;
            return;
          }
          break;
      }
    }
    this.constraints = constraints;
  }

  private patchMeta(ctx: Context): RequestMetaMetadata {
    const metadata = this.getMetadata(ctx);
    if (!metadata.constraints) {
      return metadata;
    }
    let constraints: any;
    switch (this.getMetaRequest(ctx).REQUEST_METHOD) {
      case 'GET':
        constraints = metadata.constraints.get || metadata.constraints;
        break;
      case 'POST':
        constraints = metadata.constraints.post || metadata.constraints;
        break;
      case 'PUT':
        constraints = metadata.constraints.put || metadata.constraints;
        break;
      case 'DELETE':
        constraints = metadata.constraints.delete || metadata.constraints;
        break;
      default:
        constraints = metadata.constraints;
    }
    return {...metadata, constraints};
  }

  private sconstraints(ctx: Context): (Constraints|undefined) {
    switch (this.getMetaRequest(ctx).REQUEST_METHOD) {
      case 'GET':
        return this.getConstraints || this.constraints;
      case 'POST':
        return this.postConstraints || this.constraints;
      case 'PUT':
        return this.putConstraints || this.constraints;
      case 'DELETE':
        return this.deleteConstraints || this.constraints;
      default:
        return this.constraints;
    }
  }
}
