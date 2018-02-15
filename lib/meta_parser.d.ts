import { ISyncanoContext } from 'syncano-middleware';
import { IConstraints } from './constraints';
export declare class MetaParser {
    private constraints?;
    getMeta(ctx: ISyncanoContext): Promise<IConstraints>;
}
