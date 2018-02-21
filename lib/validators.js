"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const validate_js_1 = __importDefault(require("validate.js"));
const allOf_1 = __importDefault(require("./allOf"));
const anyOf_1 = __importDefault(require("./anyOf"));
const contains_1 = __importDefault(require("./contains"));
const defined_1 = __importDefault(require("./defined"));
const empty_1 = __importDefault(require("./empty"));
const oneOf_1 = __importDefault(require("./oneOf"));
const pattern_1 = __importDefault(require("./pattern"));
const schema_1 = __importDefault(require("./schema"));
const type_1 = __importDefault(require("./type"));
validate_js_1.default.validators.allOf = allOf_1.default;
validate_js_1.default.validators.anyOf = anyOf_1.default;
validate_js_1.default.validators.contains = contains_1.default;
validate_js_1.default.validators.defined = defined_1.default;
validate_js_1.default.validators.empty = empty_1.default;
validate_js_1.default.validators.match = pattern_1.default;
validate_js_1.default.validators.oneOf = oneOf_1.default;
validate_js_1.default.validators.schema = schema_1.default;
validate_js_1.default.validators.type = type_1.default;
const validateFn = (args, constraints, options) => {
    return validate_js_1.default.async(args, constraints, options);
};
exports.default = validateFn;
exports.validators = validate_js_1.default.validators;
