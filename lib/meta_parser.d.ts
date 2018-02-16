import { Context } from '@syncano/core';
import { Constraints } from './constraints';
export declare class MetaParser {
    private constraints?;
    getMeta(ctx: Context): Promise<Constraints>;
}
