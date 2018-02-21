"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        return __awaiter(this, void 0, void 0, function* () {
            if (!validate_js_1.default.isDefined(value)) {
                return true;
            }
            if (typeof value !== 'string') {
                return false;
            }
            return value.match(this.opts.pattern) !== null;
        });
    }
}
exports.Match = Match;
exports.default = (value, opts, key, attributes) => (new Match(opts, key, attributes).validate(value));
