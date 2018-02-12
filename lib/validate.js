"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const syncano_validate_1 = require("syncano-validate");
class ValidatePlugin {
    constructor(handler, rules) {
        this.handler = handler;
        this.rules = rules;
    }
    handle(ctx, syncano) {
        return syncano_validate_1.validate(ctx.args, this.rules).then(() => this.handler(ctx, syncano));
    }
}
exports.ValidatePlugin = ValidatePlugin;
exports.default = (handler, rules) => {
    return (ctx, syncano) => {
        const validator = new ValidatePlugin(handler, rules);
        return validator.handle(ctx, syncano);
    };
};
