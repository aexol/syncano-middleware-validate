"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const validate_js_1 = __importDefault(require("validate.js"));
const validator_1 = require("./validator");
class Defined extends validator_1.Validator {
    constructor(opts) {
        if (opts === true || opts === false) {
            opts = { isDefined: opts };
        }
        if (!('message' in opts)) {
            if (opts.isDefined) {
                opts.message = 'must be defined';
            }
            else {
                opts.message = 'cannot be defined';
            }
        }
        super('isDefined', opts);
    }
    test(value) {
        return validate_js_1.default.isDefined(value) === this.opts.isDefined;
    }
}
exports.Defined = Defined;
exports.default = (value, opts) => (new Defined(opts).validate(value));
