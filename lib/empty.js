"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const validate_js_1 = __importDefault(require("validate.js"));
const validator_1 = require("./validator");
class Empty extends validator_1.Validator {
    constructor(opts) {
        if (opts === true || opts === false) {
            opts = { isEmpty: opts };
        }
        if (!('message' in opts)) {
            if (opts.isEmpty) {
                opts.message = 'must be empty';
            }
            else {
                opts.message = 'cannot be empty';
            }
        }
        super('isEmpty', opts);
    }
    test(value) {
        return validate_js_1.default.isEmpty(value) === this.opts.isEmpty;
    }
}
exports.Empty = Empty;
exports.default = (value, opts) => (new Empty(opts).validate(value));
