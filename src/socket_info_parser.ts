import Server, { Context, RequestMetaMetadata } from '@syncano/core';
import { Socket } from 'net';
import { Constraints } from './constraints';
import { MetaParser } from './meta_parser';

interface IScriptInfo {
  name: string;
  metadata: RequestMetaMetadata;
}

interface ISocketInfo {
  objects: IScriptInfo[];
}

interface ISocketContexts {
  [s: string]: Context;
}

class SocketMeta {
  private contexts?: ISocketContexts;
  public async getEndpointContext(ctx: Context, endpointName: string): Promise<Context> {
    const [socketName, scriptName, ...rest] = endpointName.split('/');
    if (!socketName || !scriptName || rest.length !== 0) {
      throw new Error('invalid endpoint name.');
    }
    if (this.contexts && this.contexts[scriptName]) {
      return this.contexts[scriptName];
    }
    const syncano = new Server(ctx);
    return syncano.socket.get(socketName)
          .then(sMeta => this.parseSocketMeta(sMeta))
          .then(contexts => contexts[endpointName]);
  }
  private parseSocketMeta(sMeta: ISocketInfo): ISocketContexts {
    this.contexts = {};
    for (const k in sMeta.objects) {
      if (!(k in sMeta.objects)) {
        continue;
      }
      const scriptInfo = sMeta.objects[k];
      this.contexts[scriptInfo.name] = {meta: scriptInfo};
    }
    return this.contexts;
  }
}

interface ISocketMetas {
  [s: string]: SocketMeta;
}

interface ISocketMetaParser {
  [s: string]: MetaParser;
}

export class NamedMetaParser {
  private socketMetas?: ISocketMetas;
  private socketParsers?: ISocketMetaParser;
  public async getMeta( ctx: Context,
                        endpointName: string): Promise<Constraints> {
    if (!this.socketParsers) {
      this.socketParsers = {};
    }
    const parsers = this.socketParsers;
    if (!(endpointName in this.socketParsers)) {
      parsers[endpointName] = new MetaParser();
    }
    return this.getContext(ctx, endpointName)
            .then(eCtx => parsers[endpointName].getMeta(eCtx));
  }
  public async getContext(ctx: Context,
                          endpointName: string): Promise<Context> {
    const [socketName, scriptName, ...rest] = endpointName.split('/');
    if (!socketName || !scriptName || rest.length !== 0) {
      throw new Error('invalid endpoint name.');
    }
    if (!this.socketMetas) {
      this.socketMetas = {};
    }
    if (socketName in this.socketMetas) {
      return this.socketMetas[socketName].getEndpointContext(ctx, endpointName);
    }
    this.socketMetas[socketName] = new SocketMeta();
    return this.socketMetas[socketName].getEndpointContext(ctx, endpointName);
  }
}
