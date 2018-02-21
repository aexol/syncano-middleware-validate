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
class OneOf extends validator_1.Validator {
    constructor(opts, key, attributes) {
        if (typeof opts !== 'object' || Array.isArray(opts)) {
            opts = { parameters: opts };
        }
        if (!('message' in opts)) {
            opts.message = 'exactly one of %(parameters)s is required';
        }
        super('oneOf', opts, key, attributes);
        this.oneOf = [];
        const params = opts.parameters;
        if (Array.isArray(params)) {
            const aOpts = params;
            for (const i in params) {
                if (typeof params[i] === 'string') {
                    this.oneOf.push(params[i]);
                }
            }
        }
    }
    test(value) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.OneOf = OneOf;
exports.default = (value, opts, key, attributes) => (new OneOf(opts, key, attributes).validate(value));
