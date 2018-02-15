import { IRawConstraints } from './constraints';
export interface ISyncanoParameter {
    type?: string;
    description?: string;
    required?: boolean;
    constraints?: IRawConstraints;
}
export interface ISyncanoParameters {
    [s: string]: ISyncanoParameter;
}
export interface ISyncanoEndpoint {
    parameters?: ISyncanoParameters;
}
