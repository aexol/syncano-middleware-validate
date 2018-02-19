import { RequestArgs, RequestMetaMetadata, RequestMetaMetadataParameters } from '@syncano/core';
import merge from 'lodash.merge';
import { IValidationError } from './validator';
import validate from './validators';

const allOf = 'allOf';
const anyOf = 'anyOf';
const oneOf = 'oneOf';

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
    const rules: Rules = endpoint.constraints || {};
    for (const k of Object.keys(parameters)) {
      if (!rules[k].type) {
        if (parameters[k].type) {
          rules[k].type = parameters[k].type;
        }
      }
      if (typeof rules[k].presence === 'undefined' ) {
        if (typeof parameters[k].required !== 'undefined' ) {
          rules[k].presence = parameters[k].required;
        }
      }
      rules[k] = merge(rules[k], parameters[k].constraints || {});
    }
    // Check for anyOf object in constraints, skip if there exists parameter
    // with that name.
    if (anyOf in rules && !(anyOf in parameters)) {
      for (const k of Object.keys(rules.anyOf)) {
        rules[k] = merge(rules[k], {k: {anyOf: rules.anyOf}});
      }
      delete rules.anyOf;
    }
    // Check for anyOf object in constraints, skip if there exists parameter
    // with that name.
    if (allOf in rules && !(allOf in parameters)) {
      for (const k of Object.keys(rules.allOf)) {
        rules[k] = merge(rules[k], {k: {allOf: rules.allOf}});
      }
      delete rules.anyOf;
    }
    // Check for oneOf object in constraints, skip if there exists parameter
    // with that name.
    if (oneOf in rules && !(oneOf in parameters)) {
      for (const k of Object.keys(rules.oneOf)) {
        rules[k] = merge(rules[k], {k: {oneOf: rules.oneOf}});
      }
      delete rules.oneOf;
    }
    this.rules = rules;
  }
  public test(args: RequestArgs): any {
    return validate(args, this.rules);
  }
}
