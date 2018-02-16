import { RequestArgs, RequestMetaMetadata, RequestMetaMetadataParameters } from '@syncano/core';
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
  type?: (string|object);
  url?: (boolean|object);
  [s: string]: any;
}

class Rules {
  [s: string]: IConstraint;
}

export class Constraints {
  private rules?: Rules;
  constructor(endpoint: RequestMetaMetadata) {
    const parameters: RequestMetaMetadataParameters = endpoint.parameters || {};
    this.rules = {};
    for (const k of Object.keys(parameters)) {
      if (!this.rules[k]) {
        this.rules[k] = {};
      }
      this.rules[k] = parameters[k].constraints as IConstraint || {};
      if (!this.rules[k].type) {
        if (parameters[k].type) {
          this.rules[k].type = parameters[k].type;
        }
      }
      if (typeof this.rules[k].presence === 'undefined' ) {
        if (typeof parameters[k].required !== 'undefined' ) {
          this.rules[k].presence = parameters[k].required;
        }
      }
    }
  }
  public test(args: RequestArgs): any {
    return validate(args, this.rules);
  }
}
