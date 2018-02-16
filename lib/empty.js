"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const validate_js_1 = __importDefault(require("validate.js"));
const validator_1 = require("./validator");
class Empty extends validator_1.Validator {
    constructor(opts, key, attribtues) {
        if (opts === true || opts === false) {
            opts = { isEmpty: opts };
        }
        if (!('message' in opts)) {
            if (opts.isEmpty) {
                opts.message = '%(key)s must be empty';
            }
            else {
                opts.message = '%(key)s cannot be empty';
            }
        }
        super('isEmpty', opts, key, attribtues);
    }
    test(value) {
        return validate_js_1.default.isEmpty(value) === this.opts.isEmpty;
    }
}
exports.Empty = Empty;
exports.default = (value, opts, key, attributes) => (new Empty(opts, key, attributes).validate(value));
