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
class Contains extends validator_1.Validator {
    constructor(opts, key, attributes) {
        if (Array.isArray(opts)) {
            opts = { collection: opts };
        }
        if (!('message' in opts)) {
            opts.message = 'collection %(coollection)s does not contain %(value)s';
        }
        super('contains', opts, key, attributes);
    }
    test(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return !validate_js_1.default.isDefined(value) || validate_js_1.default.contains(this.opts.collection, value);
        });
    }
}
exports.Contains = Contains;
exports.default = (value, opts, key, attributes) => (new Contains(opts, key, attributes).validate(value));
