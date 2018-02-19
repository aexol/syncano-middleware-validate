import { Context } from '@syncano/core';
import { Constraints } from './constraints';
export declare class MetaParser {
    private constraints?;
    private getConstraints?;
    private postConstraints?;
    private putConstraints?;
    private deleteConstraints?;
    getMeta(ctx: Context): Promise<Constraints>;
    private getMetadata(ctx);
    private getMetaRequest(ctx);
    private makeConstraints(ctx);
    private patchMeta(ctx);
    private sconstraints(ctx);
}
