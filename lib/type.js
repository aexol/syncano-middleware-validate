"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const validate_js_1 = __importDefault(require("validate.js"));
const validator_1 = require("./validator");
class Type extends validator_1.Validator {
    constructor(opts, key, attributes) {
        if (typeof opts === 'string') {
            opts = { type: opts };
        }
        if ('enum' in opts) {
            opts.type = 'enum';
        }
        if ('schema' in opts) {
            opts.type = 'schema';
        }
        if (!('message' in opts)) {
            opts.message = '%(key)s must be %(type)s';
        }
        super('type', opts, key, attributes);
    }
    test(value) {
        const f = {
            any: () => true,
            array: validate_js_1.default.isArray,
            boolean: validate_js_1.default.isBoolean,
            datetime: validate_js_1.default.isDate,
            enum: (v) => {
                for (const e in this.opts.enum) {
                    if (lodash_isequal_1.default(v, this.opts.enum[e])) {
                        return true;
                    }
                }
                return false;
            },
            integer: validate_js_1.default.isInteger,
            number: validate_js_1.default.isNumber,
            object: validate_js_1.default.isObject,
            schema: (v) => {
                const validate = new ajv_1.default().compile(this.opts.schema);
                if (!validate(v)) {
                    if (!('message' in this.opts)) {
                        // Hack message from schema validation
                        this.msg = validate.errors || 'schema validation failed';
                    }
                    return false;
                }
                return true;
            },
            string: validate_js_1.default.isString,
        };
        if (!(this.opts.type in f)) {
            throw new Error('validator error: unsupported type.');
        }
        return !validate_js_1.default.isDefined(value) || f[this.opts.type](value);
    }
}
exports.Type = Type;
exports.default = (value, opts, key, attributes) => (new Type(opts, key, attributes).validate(value));
