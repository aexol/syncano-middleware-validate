"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("./validator");
class Match extends validator_1.Validator {
    constructor(opts) {
        if (typeof opts === 'string') {
            opts = { pattern: opts };
        }
        if (!('message' in opts)) {
            opts.message = '$(value)s must match $(pattern)s';
        }
        super('match', opts);
    }
    test(value) {
        if (typeof value !== 'string') {
            return false;
        }
        return value.match(this.opts.pattern) !== null;
    }
}
exports.Match = Match;
exports.default = (value, opts) => (new Match(opts).validate(value));
