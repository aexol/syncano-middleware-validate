"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = __importDefault(require("./validators"));
class Rules {
}
class Constraints {
    constructor(endpoint) {
        const parameters = endpoint.parameters || {};
        this.rules = {};
        for (const k of Object.keys(parameters)) {
            if (!this.rules[k]) {
                this.rules[k] = {};
            }
            this.rules[k] = parameters[k].constraints || {};
            if (!this.rules[k].type) {
                if (parameters[k].type) {
                    this.rules[k].type = parameters[k].type;
                }
            }
            if (typeof this.rules[k].presence === 'undefined') {
                if (typeof parameters[k].required !== 'undefined') {
                    this.rules[k].presence = parameters[k].required;
                }
            }
        }
    }
    test(args) {
        return validators_1.default(args, this.rules);
    }
}
exports.Constraints = Constraints;
