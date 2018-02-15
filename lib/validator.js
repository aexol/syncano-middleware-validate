"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sprintf_js_1 = require("sprintf-js");
class Validator {
    constructor(validatorName, opts) {
        this.validatorName = validatorName;
        this.opts = opts;
        this.msg = opts.message ?
            opts.message : 'bad value $(value)s';
    }
    message(value) {
        return sprintf_js_1.sprintf(this.msg, Object.assign({ validatorName: this.validatorName, value }, this.opts));
    }
    validate(value) {
        if (this.test(value)) {
            return undefined;
        }
        return { [this.validatorName]: this.message(value) };
    }
}
exports.Validator = Validator;
