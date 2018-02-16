"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const validate_js_1 = __importDefault(require("validate.js"));
const contains_1 = __importDefault(require("./contains"));
const defined_1 = __importDefault(require("./defined"));
const empty_1 = __importDefault(require("./empty"));
const pattern_1 = __importDefault(require("./pattern"));
const type_1 = __importDefault(require("./type"));
validate_js_1.default.validators.contains = contains_1.default;
validate_js_1.default.validators.defined = defined_1.default;
validate_js_1.default.validators.empty = empty_1.default;
validate_js_1.default.validators.match = pattern_1.default;
validate_js_1.default.validators.type = type_1.default;
const validateFn = (args, constraints) => {
    return validate_js_1.default(args, constraints);
};
exports.default = validateFn;
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
