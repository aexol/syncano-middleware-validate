"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sprintf_js_1 = require("sprintf-js");
class Validator {
    constructor(validatorName, opts, key, attributes, globalOptions) {
        this.validatorName = validatorName;
        this.opts = opts;
        this.key = key;
        this.globalOptions = globalOptions;
        this.attributes = attributes;
        this.msg = opts.message || 'bad value %(value)s';
    }
    message(value) {
        if (typeof this.msg !== 'string') {
            return this.msg;
        }
        return sprintf_js_1.sprintf(this.msg, Object.assign({ attributes: this.attributes, key: this.key, validatorName: this.validatorName, value }, this.opts));
    }
    validate(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.test(value, (this.globalOptions || {}).ctx)
                .then((valid) => {
                if (valid) {
                    return undefined;
                }
                return { [this.validatorName]: this.message(value) };
            });
        });
    }
}
exports.Validator = Validator;
