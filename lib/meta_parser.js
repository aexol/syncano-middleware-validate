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
const lodash_get_1 = __importDefault(require("lodash.get"));
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
        if (metadata.constraint) {
            switch (this.getMetaRequest(ctx).REQUEST_METHOD) {
                case 'GET':
                    if (metadata.constraints.get) {
                        this.getConstraints = constraints;
                        return;
                    }
                    break;
                case 'POST':
                    if (metadata.constraints.post) {
                        this.postConstraints = constraints;
                        return;
                    }
                    break;
                case 'PUT':
                    if (metadata.constraints.put) {
                        this.putConstraints = constraints;
                        return;
                    }
                    break;
                case 'DELETE':
                    if (metadata.constraints.delete) {
                        this.deleteConstraints = constraints;
                        return;
                    }
                    break;
            }
        }
        this.constraints = constraints;
    }
    patchMeta(ctx) {
        const metadata = this.getMetadata(ctx);
        if (!metadata.constraints) {
            return metadata;
        }
        let constraints;
        switch (this.getMetaRequest(ctx).REQUEST_METHOD) {
            case 'GET':
                constraints = metadata.constraints.get || metadata.constraints;
                break;
            case 'POST':
                constraints = metadata.constraints.post || metadata.constraints;
                break;
            case 'PUT':
                constraints = metadata.constraints.put || metadata.constraints;
                break;
            case 'DELETE':
                constraints = metadata.constraints.delete || metadata.constraints;
                break;
            default:
                constraints = metadata.constraints;
        }
        return Object.assign({}, metadata, { constraints });
    }
    sconstraints(ctx) {
        switch (this.getMetaRequest(ctx).REQUEST_METHOD) {
            case 'GET':
                return this.getConstraints || this.constraints;
            case 'POST':
                return this.postConstraints || this.constraints;
            case 'PUT':
                return this.putConstraints || this.constraints;
            case 'DELETE':
                return this.deleteConstraints || this.constraints;
            default:
                return this.constraints;
        }
    }
}
exports.MetaParser = MetaParser;
