import { RequestArgs, RequestMetaMetadata } from '@syncano/core';
export interface IConstraint {
    contains?: (any[] | object);
    cleanAttributes?: string[];
    datetime?: object;
    defined?: (boolean | object);
    email?: (boolean | object);
    equality?: (string | object);
    exclusion?: (any[] | object);
    inclusion?: (any[] | object);
    length?: object;
    match?: (string | object);
    numericality?: (boolean | object);
    presence?: (boolean | object);
    required?: (boolean | object);
    type?: (string | object);
    url?: (boolean | object);
    [s: string]: any;
}
export declare class Constraints {
    private rules?;
    constructor(endpoint: RequestMetaMetadata);
    test(args: RequestArgs): any;
}
