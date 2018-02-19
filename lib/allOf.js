"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const validate_js_1 = __importDefault(require("validate.js"));
const validator_1 = require("./validator");
class AllOf extends validator_1.Validator {
    constructor(opts, key, attributes) {
        if (typeof opts !== 'object' || Array.isArray(opts)) {
            opts = { parameters: opts };
        }
        if (!('message' in opts)) {
            opts.message = 'all of %(parameters)s are required';
        }
        super('allOf', opts, key, attributes);
        this.allOf = [];
        const params = opts.parameters;
        if (Array.isArray(params)) {
            const aOpts = params;
            for (const i in params) {
                if (typeof params[i] === 'string') {
                    this.allOf.push(params[i]);
                }
            }
        }
    }
    test(value) {
        const checkValue = (v) => validate_js_1.default.isDefined(v) && !validate_js_1.default.isEmpty(v);
        let count = 0;
        for (const k of Object.keys(this.attributes)) {
            if (checkValue(this.attributes[k])) {
                count++;
            }
        }
        return count === this.opts.parameters.length;
    }
}
exports.AllOf = AllOf;
exports.default = (value, opts, key, attributes) => (new AllOf(opts, key, attributes).validate(value));
