import validateJs from 'validate.js';
import contains from './contains';
import defined from './defined';
import empty from './empty';
import match from './pattern';
import schema from './schema';
import type from './type';
import {ValidationResult} from './validator';

validateJs.validators.contains = contains;
validateJs.validators.defined = defined;
validateJs.validators.empty = empty;
validateJs.validators.match = match;
validateJs.validators.$schema = schema;
validateJs.validators.type = type;

const validateFn: any = (args: any, constraints: any, options?: any): Promise<any> => {
  return validateJs.async(args, constraints, options);
};
export default validateFn;
export const validators = validateJs.validators;
