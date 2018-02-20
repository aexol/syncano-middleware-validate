"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const validate_js_1 = __importDefault(require("validate.js"));
const validator_1 = require("./validator");
class Schema extends validator_1.Validator {
    constructor(opts, key, attributes, globalOptions) {
        if (!('schema' in opts)) {
            opts = { schema: opts };
        }
        super('schema', opts, key, attributes, globalOptions);
        const schemas = [
            Object.assign({}, this.opts.schema, { $id: 'http://local/schemas/parameter' }),
        ];
        const ctx = (this.globalOptions || {}).ctx;
        if (ctx) {
            schemas.push(Object.assign({}, (ctx.meta || {}).metadata, { $id: 'http://local/schemas/endpoint' }));
        }
        this.ajv = new ajv_1.default({ schemas });
    }
    test(value, ctx) {
        if (!validate_js_1.default.isDefined(value)) {
            return true;
        }
        const validate = this.ajv.getSchema('http://local/schemas/parameter');
        if (!validate(value)) {
            this.msg = this.opts.message ||
                validate.errors ||
                'does not match schema';
            return false;
        }
        return true;
    }
}
exports.Schema = Schema;
exports.default = (value, opts, key, attributes, globalOptions) => (new Schema(opts, key, attributes, globalOptions).validate(value));
