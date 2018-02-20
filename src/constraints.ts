import { Context, RequestArgs, RequestMetaMetadata, RequestMetaMetadataParameters } from '@syncano/core';
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
    const parameters: RequestMetaMetadataParameters = endpoint.parameters || {};
    if ('schema' in parameters) {
      this.rules = {
        parameters: {schema: parameters.schema},
      };
      this.paramsSchema = true;
      return;
    }
    let rules: Rules = endpoint.constraints || {};
    for (const k of Object.keys(parameters)) {
      if (!rules[k]) {
        rules[k] = {};
      }
      if ('schema' in parameters[k]) {
          rules = merge(rules, {[k]: {schema: parameters[k].schema}});
      }
      if (!rules[k].type) {
        if (parameters[k].type) {
          rules = merge(rules, {[k]: {type: parameters[k].type}});
        }
      }
      if (typeof rules[k].presence === 'undefined' ) {
        if (typeof parameters[k].required !== 'undefined' ) {
          rules = merge(rules, {[k]: {presence: parameters[k].required}});
        }
      }
      rules = merge(rules, {[k]: parameters[k].constraints || {}});
    }
    // Check for anyOf object in constraints, skip if there exists parameter
    // with that name.
    if (anyOf in rules && !(anyOf in parameters)) {
      for (const k of Object.keys(rules.anyOf)) {
        rules = merge(rules, {[k]: {anyOf: rules.anyOf}});
      }
      delete rules.anyOf;
    }
    // Check for anyOf object in constraints, skip if there exists parameter
    // with that name.
    if (allOf in rules && !(allOf in parameters)) {
      for (const k of Object.keys(rules.allOf)) {
        rules = merge(rules, {[k]: {allOf: rules.allOf}});
      }
      delete rules.allOf;
    }
    // Check for oneOf object in constraints, skip if there exists parameter
    // with that name.
    if (oneOf in rules && !(oneOf in parameters)) {
      for (const k of Object.keys(rules.oneOf)) {
        rules = merge(rules, {[k]: {oneOf: rules.oneOf}});
      }
      delete rules.oneOf;
    }
    this.rules = rules;
  }
  public test(args: RequestArgs, ctx?: Context): any {
    if (this.paramsSchema) {
      return validate({parameters: args}, this.rules, {ctx});
    }
    return validate(args, this.rules, {ctx});
  }
}
