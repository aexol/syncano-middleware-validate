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
const syncano_middleware_1 = require("syncano-middleware");
const meta_parser_1 = require("./meta_parser");
const socket_info_parser_1 = require("./socket_info_parser");
class ValidatePlugin {
    constructor(handler, endpointMeta) {
        this.handler = handler;
        this.endpointMeta = endpointMeta;
    }
    handle(ctx, syncano) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.endpointMeta.test(ctx.args || {}, ctx, syncano)
                .then(validationResult => {
                if (validationResult) {
                    return syncano_middleware_1.response(validationResult, 400);
                }
                return this.handler(ctx, syncano);
            });
        });
    }
}
exports.ValidatePlugin = ValidatePlugin;
const metaParser = new meta_parser_1.MetaParser();
function makeValidator(ctx, handler) {
    return __awaiter(this, void 0, void 0, function* () {
        return metaParser
            .getMeta(ctx)
            .then(endpointMeta => new ValidatePlugin(handler, endpointMeta));
    });
}
const namedMetaParser = new socket_info_parser_1.NamedMetaParser();
function makeNamedValidator(ctx, endpointName) {
    return __awaiter(this, void 0, void 0, function* () {
        return namedMetaParser.getMeta(ctx, endpointName);
    });
}
exports.default = (handler) => (ctx, syncano) => makeValidator(ctx, handler)
    .then(validator => validator.handle(ctx, syncano));
function validateByEndpointName(args, ctx, endpointName, syncano) {
    return __awaiter(this, void 0, void 0, function* () {
        return makeNamedValidator(ctx, endpointName)
            .then(v => v.constraints.test(args, v.context, syncano));
    });
}
exports.validateByEndpointName = validateByEndpointName;
var validators_1 = require("./validators");
exports.validators = validators_1.validators;
