"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const validate_js_1 = __importDefault(require("validate.js"));
const validator_1 = require("./validator");
class Match extends validator_1.Validator {
    constructor(opts, key, attribtues) {
        if (typeof opts === 'string') {
            opts = { pattern: opts };
        }
        if (!('message' in opts)) {
            opts.message = '%(key)s must match %(pattern)s';
        }
        super('match', opts, key, attribtues);
    }
    test(value) {
        if (!validate_js_1.default.isDefined(value)) {
            return true;
        }
        if (typeof value !== 'string') {
            return false;
        }
        return value.match(this.opts.pattern) !== null;
    }
}
exports.Match = Match;
exports.default = (value, opts, key, attributes) => (new Match(opts, key, attributes).validate(value));
