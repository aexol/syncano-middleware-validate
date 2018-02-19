"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const validate_js_1 = __importDefault(require("validate.js"));
const validator_1 = require("./validator");
class OneOf extends validator_1.Validator {
    constructor(opts, key, attributes) {
        if (typeof opts !== 'object') {
            opts.parameters = opts;
        }
        if (!('message' in opts)) {
            opts.message = 'exactly one of %(parameters)s is required';
        }
        super('oneOf', opts, key, attributes);
        this.oneOf = [];
        if (Array.isArray(opts.parameters)) {
            const aOpts = opts;
            for (const i in opts) {
                if (typeof opts[i] === 'string') {
                    this.oneOf.push(opts[i]);
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
            if (count > 1) {
                break;
            }
        }
        return count === 1;
    }
}
exports.OneOf = OneOf;
exports.default = (value, opts, key, attributes) => (new OneOf(opts, key, attributes).validate(value));