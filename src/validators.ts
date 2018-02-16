import validateJs from 'validate.js';
import contains from './contains';
import defined from './defined';
import empty from './empty';
import match from './pattern';
import type from './type';
import {ValidationResult} from './validator';

validateJs.validators.contains = contains;
validateJs.validators.defined = defined;
validateJs.validators.empty = empty;
validateJs.validators.match = match;
validateJs.validators.type = type;

const validateFn: any = (args: any, constraints: any): any => {
  return validateJs(args, constraints);
};
export default validateFn;
// export validateJs; from; 'validate.js';
//
// export type ValidationFn = (value: any, options: any) => ValidationResult;
//
// export interface IValidators {
//   contains: ValidationFn;
//   cleanAttributes: (attributes: any, whitelist: any) => any;
//   datetime: ValidationFn;
//   defined: ValidationFn;
//   email: ValidationFn;
//   empty: ValidationFn;
//   equality: ValidationFn;
//   exclusion: ValidationFn;
//   inclusion: ValidationFn;
//   length: ValidationFn;
//   match: ValidationFn;
//   numericality: ValidationFn;
//   presence: ValidationFn;
//   required: ValidationFn;
//   type: ValidationFn;
//   url: ValidationFn;
//   [s: string]: ValidationFn;
// }
//
// function validate(values: any, options: any, fn: ValidationFn): ValidationResult {
//   if (options) {
//     return fn(values, options);
//   }
//  }
//  function validateJsCall(values: any, options: any, validatorName: string): ValidationResult {
//   if (options) {
//     return fn(values, options);
//   }
//  }
//  export class Validators implements IValidators {
//   public contains(values: any, options: any): ValidationResult {
//     return validate(values, options, contains);
//   }
//   public cleanAttributes(values: any, options: any): any {
//     return validateJs.cleanAttributes(values, options);
//   }
//   public datetime(values: any, options: any): ValidationResult {
//     return validate(values, options, validateJs.validators.datetime);
//   }
//   public defined(values: any, options: any): ValidationResult {
//     return validate(values, options, defined);
//   }
//   public email(values: any, options: any): ValidationResult {
//     return validate(values, options, validateJs.validators.email);
//   }
//   public empty(values: any, options: any): ValidationResult {
//     return validate(values, options, empty);
//   }
//   public equality(values: any, options: any): ValidationResult {
//     return validate(values, options, validateJs.validators.equality);
//   }
//   public exclusion(values: any, options: any): ValidationResult {
//     return validate(values, options, validateJs.validators.exclusion);
//   }
//   public inclusion(values: any, options: any): ValidationResult {
//     return validate(values, options, validateJs.validators.inclusion);
//   }
//   public length(values: any, options: any): ValidationResult {
//     return validate(values, options, validateJs.validators.length);
//   }
//   public match(values: any, options: any): ValidationResult {
//     return validate(values, options, match);
//   }
//   public numericality(values: any, options: any): ValidationResult {
//     return validate(values, options, validateJs.validators.numericality);
//   }
//   public presence(values: any, options: any): ValidationResult {
//     return validate(values, options, validateJs.validators.presence);
//   }
//   public required(values: any, options: any): ValidationResult {
//     return this.presence(values, options);
//   }
//   public type(values: any, options: any): ValidationResult {
//     return validate(values, options, type);
//   }
//   public url(values: any, options: any): ValidationResult {
//     return validate(values, options, validateJs.validators.url);
//   }
//   [s: string]: ValidationFn
//  }
//
//  export default new Validators();
