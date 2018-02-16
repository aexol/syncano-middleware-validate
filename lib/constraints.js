"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_transformer_keys_1 = require("ts-transformer-keys");
class ConstraintSchema {
}
class Constraint extends ConstraintSchema {
    constructor(args = {}) {
        super();
        Object.assign(this, args);
    }
    rules() {
        const okeys = [];
        for (const k of ts_transformer_keys_1.keys()) {
            if (k in this) {
                okeys.push({
                    options: this[k],
                    rule: k,
                });
            }
        }
        return okeys;
    }
}
class Constraints {
    constructor(endpoint) {
        const parameters = endpoint.parameters || {};
        this.constraints = {};
        for (const k of Object.keys(parameters)) {
            this.constraints[k] = new Constraint(parameters[k].constraints || {});
            if (!this.constraints[k].type) {
                if (parameters[k].type) {
                    this.constraints[k].type = parameters[k].type;
                }
            }
        }
    }
    test(args, validators) {
        const results = [];
        for (const param of Object.keys(this.constraints)) {
            const constraint = this.constraints[param];
            for (const r of constraint.rules()) {
                const res = validators[r.rule](args[param], r.options);
                if (res) {
                    results.push(res);
                }
            }
        }
        return results.length !== 0 ? results : undefined;
    }
}
exports.Constraints = Constraints;
