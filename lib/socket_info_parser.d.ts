import { Context } from '@syncano/core';
import { Constraints } from './constraints';
export interface IConstraintsWithContext {
    constraints: Constraints;
    context: Context;
}
export declare class NamedMetaParser {
    private socketMetas?;
    private socketParsers?;
    getMeta(ctx: Context, endpointName: string): Promise<IConstraintsWithContext>;
    getContext(ctx: Context, endpointName: string): Promise<Context>;
}
