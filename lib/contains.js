"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const validate_js_1 = __importDefault(require("validate.js"));
const validator_1 = require("./validator");
class Contains extends validator_1.Validator {
    constructor(opts) {
        if (Array.isArray(opts)) {
            opts = { collection: opts };
        }
        if (!('message' in opts)) {
            opts.message = 'collection $(coollection)s does not contain $(value)s';
        }
        super('contains', opts);
    }
    test(value) {
        return !validate_js_1.default.isDefined(value) || validate_js_1.default.contains(this.opts.collection, value);
    }
}
exports.Contains = Contains;
exports.default = (value, opts) => (new Contains(opts).validate(value));
