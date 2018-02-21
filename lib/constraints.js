"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const validators_1 = __importDefault(require("./validators"));
const allOf = 'allOf';
const anyOf = 'anyOf';
const oneOf = 'oneOf';
class Rules {
}
class Constraints {
    constructor(endpoint) {
        const parameters = endpoint.parameters || {};
        if ('schema' in parameters) {
            this.rules = {
                parameters: { schema: parameters.schema },
            };
            this.paramsSchema = true;
            return;
        }
        let rules = endpoint.constraints || {};
        console.log(rules);
        for (const k of Object.keys(parameters)) {
            if (!rules[k]) {
                rules[k] = {};
            }
            if ('schema' in parameters[k]) {
                rules = lodash_merge_1.default(rules, { [k]: { schema: parameters[k].schema } });
            }
            if (!rules[k].type) {
                if (parameters[k].type) {
                    rules = lodash_merge_1.default(rules, { [k]: { type: parameters[k].type } });
                }
            }
            if (typeof rules[k].presence === 'undefined') {
                if (typeof parameters[k].required !== 'undefined') {
                    rules = lodash_merge_1.default(rules, { [k]: { presence: parameters[k].required } });
                }
            }
            rules = lodash_merge_1.default(rules, { [k]: parameters[k].constraints || {} });
        }
        // Check for anyOf object in constraints, skip if there exists parameter
        // with that name.
        if (anyOf in rules && !(anyOf in parameters)) {
            for (const k of Object.keys(rules.anyOf)) {
                rules = lodash_merge_1.default(rules, { [k]: { anyOf: rules.anyOf } });
            }
            delete rules.anyOf;
        }
        // Check for anyOf object in constraints, skip if there exists parameter
        // with that name.
        if (allOf in rules && !(allOf in parameters)) {
            for (const k of Object.keys(rules.allOf)) {
                rules = lodash_merge_1.default(rules, { [k]: { allOf: rules.allOf } });
            }
            delete rules.allOf;
        }
        // Check for oneOf object in constraints, skip if there exists parameter
        // with that name.
        if (oneOf in rules && !(oneOf in parameters)) {
            for (const k of Object.keys(rules.oneOf)) {
                rules = lodash_merge_1.default(rules, { [k]: { oneOf: rules.oneOf } });
            }
            delete rules.oneOf;
        }
        this.rules = rules;
    }
    test(args, ctx) {
        if (this.paramsSchema) {
            return validators_1.default({ parameters: args }, this.rules, { ctx });
        }
        return validators_1.default(args, this.rules, { ctx });
    }
}
exports.Constraints = Constraints;
