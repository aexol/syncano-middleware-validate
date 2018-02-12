"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const syncano_validate_1 = require("syncano-validate");
class ValidatePlugin {
    constructor(handler, rules) {
        this.handler = handler;
        this.rules = rules;
    }
    handle(ctx, syncano) {
        return syncano_validate_1.validate(ctx.args, this.rules).catch((e) => {
            throw {
                payload: e,
                status: 400,
            };
        }).then(() => this.handler(ctx, syncano));
    }
}
exports.ValidatePlugin = ValidatePlugin;
exports.default = (handler, rules) => (ctx, syncano) => (new ValidatePlugin(handler, rules)).handle(ctx, syncano);
