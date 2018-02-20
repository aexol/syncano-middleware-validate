import { Context } from '@syncano/core';
import { Constraints } from './constraints';
export declare class NamedMetaParser {
    private socketMetas?;
    private socketParsers?;
    getMeta(ctx: Context, endpointName: string): Promise<Constraints>;
    getContext(ctx: Context, endpointName: string): Promise<Context>;
}
