"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_find_1 = __importDefault(require("lodash.find"));
const lodash_get_1 = __importDefault(require("lodash.get"));
const lodash_set_1 = __importDefault(require("lodash.set"));
const constraints_1 = require("./constraints");
class MetaParser {
    getMeta(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.sconstraints(ctx)) {
                this.makeConstraints(ctx);
            }
            return this.sconstraints(ctx);
        });
    }
    getMetadata(ctx) {
        return lodash_get_1.default(ctx, 'meta.metadata', {});
    }
    getMetaRequest(ctx) {
        return lodash_get_1.default(ctx, 'meta.request', {});
    }
    makeConstraints(ctx) {
        const metadata = this.getMetadata(ctx);
        const constraints = new constraints_1.Constraints(this.patchMeta(ctx));
        const method = this.getMethod(ctx);
        const setTarget = method ?
            method.toLowerCase() + 'Constraints' : 'constraints';
        lodash_set_1.default(this, setTarget, constraints);
    }
    patchMeta(ctx) {
        const metadata = this.getMetadata(ctx);
        if (!metadata.constraints) {
            return metadata;
        }
        const method = this.getMethod(ctx);
        const constraints = method ? lodash_get_1.default(metadata.constraints, method.toLowerCase(), metadata.constraints) : metadata.constraints;
        return Object.assign({}, metadata, { constraints });
    }
    sconstraints(ctx) {
        const method = this.getMethod(ctx);
        if (!method) {
            return this.constraints;
        }
        return lodash_get_1.default(this, method.toLowerCase() + 'Constraints', this.constraints);
    }
    getMethod(ctx) {
        const method = this.getMetaRequest(ctx).REQUEST_METHOD;
        return lodash_find_1.default([
            'DELETE',
            'GET',
            'POST',
            'PUT',
        ], v => v === method);
    }
}
exports.MetaParser = MetaParser;
