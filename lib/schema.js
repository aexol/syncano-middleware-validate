"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const validator_1 = require("./validator");
class Schema extends validator_1.Validator {
    constructor(opts, key, attributes) {
        super('schema', opts, key, attributes);
    }
    test(value, ctx) {
        const ajv = new ajv_1.default();
        if (ctx) {
            ajv.addSchema(Object.assign({}, ctx, { $id: 'http://local/socket.json' }));
        }
        const validate = ajv.compile(this.opts.schema);
        if (!validate(value)) {
            this.msg = validate.errors || 'does not match schema';
        }
        return true;
    }
}
exports.Schema = Schema;
exports.default = (value, opts, key, attributes) => (new Schema(opts, key, attributes).validate(value));
