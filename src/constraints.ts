import Server, { Context, RequestArgs, RequestMetaMetadata, RequestMetaMetadataParameters } from '@syncano/core';
import merge from 'lodash.merge';
import { IValidationError } from './validator';
import validate from './validators';

export interface IConstraint {
  contains?: (any[]|object);
  cleanAttributes?: string[];
  datetime?: object;
  defined?: (boolean|object);
  email?: (boolean|object);
  equality?: (string|object);
  exclusion?: (any[]|object);
  inclusion?: (any[]|object);
  length?: object;
  match?: (string|object);
  numericality?: (boolean|object);
  presence?: (boolean|object);
  required?: (boolean|object);
  schema?: object;
  type?: (string|object);
  url?: (boolean|object);
  [s: string]: any;
}

class Rules {
  [s: string]: IConstraint;
}

export class Constraints {
  private rules?: Rules;
  private paramsSchema?: boolean;
  constructor(endpoint: RequestMetaMetadata) {
    const parameters: RequestMetaMetadataParameters =
            merge(endpoint.parameters || {}, endpoint.constraints || {});
    if ('$schema' in parameters) {
      this.rules = {
        parameters: {$schema: parameters.$schema},
      };
      this.paramsSchema = true;
      return;
    }
    let rules: Rules =  {};
    for (const k of Object.keys(parameters)) {
      if (!rules[k]) {
        rules[k] = {};
      }
      if (typeof parameters[k].presence === 'undefined' ) {
        if (typeof parameters[k].required !== 'undefined' ) {
          parameters[k].presence = parameters[k].required;
          delete parameters[k].required;
        }
      }
      rules = merge(rules, {[k]: parameters[k] || {}});
    }
    this.rules = rules;
  }
  public test(args: RequestArgs, ctx?: Context, syncano?: Server): Promise<any> {
    if (this.paramsSchema) {
      return validate({parameters: args}, this.rules, {ctx, syncano});
    }
    return validate(args, this.rules, {ctx, syncano});
  }
}
