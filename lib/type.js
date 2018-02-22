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
class Type extends validator_1.Validator {
    constructor(opts, key, attributes) {
        if (typeof opts === 'string') {
            opts = { type: opts };
        }
        if (!('message' in opts)) {
            opts.message = '%(key)s must be %(type)s';
        }
        super('type', opts, key, attributes);
    }
    test(value, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const f = {
                any: () => true,
                array: validate_js_1.default.isArray,
                boolean: validate_js_1.default.isBoolean,
                datetime: validate_js_1.default.isDate,
                integer: validate_js_1.default.isInteger,
                number: validate_js_1.default.isNumber,
                object: validate_js_1.default.isObject,
                string: validate_js_1.default.isString,
            };
            if (!(this.opts.type in f)) {
                throw new Error('validator error: unsupported type.');
            }
            return !validate_js_1.default.isDefined(value) || f[this.opts.type](value);
        });
    }
}
exports.Type = Type;
exports.default = (value, opts, key, attributes) => (new Type(opts, key, attributes).validate(value));
