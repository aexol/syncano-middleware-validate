import { Context } from '@syncano/core';
import { IConstraints } from './constraints';
export declare class MetaParser {
    private constraints?;
    getMeta(ctx: Context): Promise<IConstraints>;
}
