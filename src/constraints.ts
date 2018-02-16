import { RequestArgs, RequestMetaMetadata, RequestMetaMetadataParameters } from '@syncano/core';
import { IValidationError } from './validator';
import {IValidators} from './validators';

export type ContraintOpts = any;
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
export interface IRule {
  rule: string;
  options: any;
}
export interface IRules {
  rules(): IRule[];
}
class ConstraintSchema implements IConstraint {
  public contains?: (any[]|object);
  public cleanAttributes?: string[];
  public datetime?: object;
  public defined?: (boolean|object);
  public email?: (boolean|object);
  public equality?: (string|object);
  public exclusion?: (any[]|object);
  public inclusion?: (any[]|object);
  public length?: object;
  public match?: (string|object);
  public numericality?: (boolean|object);
  public presence?: (boolean|object);
  public required?: (boolean|object);
  public type?: (string|object);
  public url?: (boolean|object);
  [s: string]: any;
}

class Constraint implements IRules {
  constructor(private schema: ConstraintSchema = {}) {}
  public rules(): IRule[] {
    const okeys: IRule[] = [] ;
    for (const k of Object.keys(this.schema)) {
      if (k in this.schema) {
        okeys.push({
          options: this.schema[k],
          rule: k,
        });
      }
    }
    return okeys;
  }
}

export interface IConstraintsList {
  [param: string]: IRules&IConstraint;
}
export type ValidationResults = IValidationError[]|undefined;
export interface IConstraints {
  constraints: IConstraintsList;
  test(args: RequestArgs, validators: IValidators): ValidationResults;
}

export interface IRawConstraint {
  [param: string]: object;
}

export interface IRawConstraints {
  [param: string]: IRawConstraint;
}
export class Constraints implements IConstraints {
  public constraints: IConstraintsList;
  constructor(endpoint: RequestMetaMetadata) {
    const parameters: RequestMetaMetadataParameters = endpoint.parameters || {};
    this.constraints = {};
    for (const k of Object.keys(parameters)) {
      this.constraints[k] = new Constraint(parameters[k].constraints || {});
      if (!this.constraints[k].type) {
        if (parameters[k].type) {
          this.constraints[k].type = parameters[k].type;
        }
      }
    }
  }
  public test(args: RequestArgs, validators: IValidators): ValidationResults {
    const results: IValidationError[] = [];
    for (const param of Object.keys(this.constraints)) {
      const constraint = this.constraints[param];
      for (const r of constraint.rules()) {
        const res = validators[r.rule](args[param], r.options);
        if (res) {
          results.push(res);
        }
      }
    }
    return results.length !== 0 ? results : undefined;
  }
}
