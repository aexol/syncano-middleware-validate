"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const validate_js_1 = __importDefault(require("validate.js"));
const contains_1 = __importDefault(require("./contains"));
const defined_1 = __importDefault(require("./defined"));
const empty_1 = __importDefault(require("./empty"));
const pattern_1 = __importDefault(require("./pattern"));
const type_1 = __importDefault(require("./type"));
function validate(values, options, fn) {
    if (options) {
        return fn(values, options);
    }
}
class Validators {
    contains(values, options) {
        return validate(values, options, contains_1.default);
    }
    cleanAttributes(values, options) {
        return validate_js_1.default.cleanAttributes(values, options);
    }
    datetime(values, options) {
        return validate(values, options, validate_js_1.default.validators.datetime);
    }
    defined(values, options) {
        return validate(values, options, defined_1.default);
    }
    email(values, options) {
        return validate(values, options, validate_js_1.default.validators.email);
    }
    empty(values, options) {
        return validate(values, options, empty_1.default);
    }
    equality(values, options) {
        return validate(values, options, validate_js_1.default.validators.equality);
    }
    exclusion(values, options) {
        return validate(values, options, validate_js_1.default.validators.exclusion);
    }
    inclusion(values, options) {
        return validate(values, options, validate_js_1.default.validators.inclusion);
    }
    length(values, options) {
        return validate(values, options, validate_js_1.default.validators.length);
    }
    match(values, options) {
        return validate(values, options, pattern_1.default);
    }
    numericality(values, options) {
        return validate(values, options, validate_js_1.default.validators.numericality);
    }
    presence(values, options) {
        return validate(values, options, validate_js_1.default.validators.presence);
    }
    required(values, options) {
        return this.presence(values, options);
    }
    type(values, options) {
        return validate(values, options, type_1.default);
    }
    url(values, options) {
        return validate(values, options, validate_js_1.default.validators.url);
    }
}
exports.Validators = Validators;
exports.default = new Validators();
