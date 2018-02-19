"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const validate_js_1 = __importDefault(require("validate.js"));
const validator_1 = require("./validator");
class AnyOf extends validator_1.Validator {
    constructor(opts, key, attributes) {
        if (typeof opts !== 'object' || Array.isArray(opts)) {
            opts = { parameters: opts };
        }
        if (!('message' in opts)) {
            opts.message = 'atleast one of %(parameters)s is required';
        }
        super('anyOf', opts, key, attributes);
        this.anyOf = [];
        const params = opts.parameters;
        if (Array.isArray(params)) {
            const aOpts = params;
            for (const i in params) {
                if (typeof params[i] === 'string') {
                    this.anyOf.push(params[i]);
                }
            }
        }
    }
    test(value) {
        const checkValue = (v) => validate_js_1.default.isDefined(v) && !validate_js_1.default.isEmpty(v);
        if (checkValue(value)) {
            return true;
        }
        for (const k of Object.keys(this.attributes)) {
            if (checkValue(this.attributes[k])) {
                return true;
            }
        }
        return false;
    }
}
exports.AnyOf = AnyOf;
exports.default = (value, opts, key, attributes) => (new AnyOf(opts, key, attributes).validate(value));
