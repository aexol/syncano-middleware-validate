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
        const parameters = lodash_merge_1.default(endpoint.parameters || {}, endpoint.constraints || {});
        if ('$schema' in parameters) {
            this.rules = {
                parameters: { $schema: parameters.$schema },
            };
            this.paramsSchema = true;
            return;
        }
        let rules = {};
        for (const k of Object.keys(parameters)) {
            if (!rules[k]) {
                rules[k] = {};
            }
            if (typeof parameters[k].presence === 'undefined') {
                if (typeof parameters[k].required !== 'undefined') {
                    parameters[k].presence = parameters[k].required;
                    delete parameters[k].required;
                }
            }
            rules = lodash_merge_1.default(rules, { [k]: parameters[k] || {} });
        }
        this.rules = rules;
    }
    test(args, ctx, syncano) {
        if (this.paramsSchema) {
            return validators_1.default({ parameters: args }, this.rules, { ctx, syncano });
        }
        return validators_1.default(args, this.rules, { ctx, syncano });
    }
}
exports.Constraints = Constraints;
