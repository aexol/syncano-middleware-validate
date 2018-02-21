"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const lodash_get_1 = __importDefault(require("lodash.get"));
const validate_js_1 = __importDefault(require("validate.js"));
const validator_1 = require("./validator");
function makeAjv() {
    const ajv = new ajv_1.default();
    require('ajv-merge-patch')(ajv);
    require('ajv-keywords')(ajv);
    return ajv;
}
const globalAjv = makeAjv();
class Schema extends validator_1.Validator {
    constructor(opts, key, attributes, globalOptions) {
        opts = { schema: lodash_get_1.default(opts, 'schema', opts) };
        super('schema', opts, key, attributes, globalOptions);
        this.ctx = lodash_get_1.default(this, 'globalOptions.ctx');
        this.name = lodash_get_1.default(this, 'ctx.meta.executor') ||
            lodash_get_1.default(this, 'ctx.meta.name') ||
            'local';
        this.ajv = this.name === 'local' ? makeAjv() : globalAjv;
        this.paramId = this.makeId('parameter');
    }
    test(value, ctx) {
        if (!validate_js_1.default.isDefined(value)) {
            return true;
        }
        const validate = this.getSchema();
        if (!validate(value)) {
            this.msg = this.opts.message ||
                validate.errors ||
                'does not match schema';
            return false;
        }
        return true;
    }
    makeId(schemaId) {
        return `http://${this.name}/schemas/${schemaId}`;
    }
    makeSchema() {
        this.ajv.addSchema(Object.assign({}, this.opts.schema, { $id: this.paramId }));
        if (this.ctx) {
            const endpointId = this.makeId('endpoint');
            this.ajv.addSchema(Object.assign({}, lodash_get_1.default(this.ctx, 'meta.metadata', {}), { $id: endpointId }));
        }
        return this.ajv.getSchema(this.paramId);
    }
    getSchema() {
        return this.ajv.getSchema(this.paramId) || this.makeSchema();
    }
}
exports.Schema = Schema;
exports.default = (value, opts, key, attributes, globalOptions) => (new Schema(opts, key, attributes, globalOptions).validate(value));
