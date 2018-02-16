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
class ValidatePlugin {
    constructor(handler, endpointMeta) {
        this.handler = handler;
        this.endpointMeta = endpointMeta;
    }
    handle(ctx, syncano) {
        return __awaiter(this, void 0, void 0, function* () {
            const validationResult = this.endpointMeta.test(ctx.args || {});
            if (validationResult) {
                return syncano_middleware_1.response(validationResult, 400);
            }
            return this.handler(ctx, syncano);
        });
    }
}
exports.ValidatePlugin = ValidatePlugin;
function makeValidator(ctx, handler) {
    return __awaiter(this, void 0, void 0, function* () {
        return new meta_parser_1.MetaParser()
            .getMeta(ctx)
            .then(endpointMeta => new ValidatePlugin(handler, endpointMeta));
    });
}
exports.default = (handler) => (ctx, syncano) => makeValidator(ctx, handler)
    .then(validator => validator.handle(ctx, syncano));
