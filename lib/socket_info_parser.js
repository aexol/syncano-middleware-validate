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
const core_1 = __importDefault(require("@syncano/core"));
const meta_parser_1 = require("./meta_parser");
class SocketMeta {
    getEndpointContext(ctx, endpointName) {
        return __awaiter(this, void 0, void 0, function* () {
            const [socketName, scriptName, ...rest] = endpointName.split('/');
            if (!socketName || !scriptName || rest.length !== 0) {
                throw new Error('invalid endpoint name.');
            }
            if (this.contexts && this.contexts[scriptName]) {
                return this.contexts[scriptName];
            }
            const syncano = new core_1.default(ctx);
            return syncano.endpoint.get(socketName)
                .then((sMeta) => this.parseSocketMeta(sMeta))
                .then(contexts => contexts[endpointName]);
        });
    }
    parseSocketMeta(sMeta) {
        this.contexts = {};
        for (const k in sMeta.objects) {
            if (!(k in sMeta.objects)) {
                continue;
            }
            const scriptInfo = sMeta.objects[k];
            this.contexts[scriptInfo.name] = { meta: scriptInfo };
        }
        return this.contexts;
    }
}
class NamedMetaParser {
    getMeta(ctx, endpointName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.socketParsers) {
                this.socketParsers = {};
            }
            const parsers = this.socketParsers;
            if (!(endpointName in this.socketParsers)) {
                parsers[endpointName] = new meta_parser_1.MetaParser();
            }
            return this.getContext(ctx, endpointName)
                .then(eCtx => parsers[endpointName].getMeta(eCtx)
                .then(constraints => ({ constraints, context: eCtx })));
        });
    }
    getContext(ctx, endpointName) {
        return __awaiter(this, void 0, void 0, function* () {
            const [socketName, scriptName, ...rest] = endpointName.split('/');
            if (!socketName || !scriptName || rest.length !== 0) {
                throw new Error('invalid endpoint name.');
            }
            if (!this.socketMetas) {
                this.socketMetas = {};
            }
            if (socketName in this.socketMetas) {
                return this.socketMetas[socketName].getEndpointContext(ctx, endpointName);
            }
            this.socketMetas[socketName] = new SocketMeta();
            return this.socketMetas[socketName].getEndpointContext(ctx, endpointName);
        });
    }
}
exports.NamedMetaParser = NamedMetaParser;
