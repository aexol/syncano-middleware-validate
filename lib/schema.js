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
const ajv_1 = __importDefault(require("ajv"));
const bluebird_1 = __importDefault(require("bluebird"));
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const lodash_get_1 = __importDefault(require("lodash.get"));
const lodash_has_1 = __importDefault(require("lodash.has"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const lodash_unset_1 = __importDefault(require("lodash.unset"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const validate_js_1 = __importDefault(require("validate.js"));
const validator_1 = require("./validator");
const readFile = bluebird_1.default.promisify(fs_1.default.readFile);
function makeAjv() {
    const ajv = new ajv_1.default({ $data: true });
    ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
    require('ajv-merge-patch')(ajv);
    require('ajv-keywords')(ajv);
    return ajv;
}
function mergeWithFileContents(o, key, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(fn.startsWith('/'))) {
                fn = '/app/code/' + fn;
            }
            const extraYaml = yield readFile(fn).
                then(b => js_yaml_1.default.safeLoad(b.toString()));
            o = lodash_merge_1.default(o, extraYaml);
        }
        catch (e) {
            // Just pass
        }
        return o;
    });
}
function interpolateDeep(o, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof o !== 'object') {
            return o;
        }
        yield bluebird_1.default.Promise.map(Object.keys(o), (k) => {
            return interpolateDeep(o[k], opts).then(v => ({ [k]: v }));
        }).each(newK => {
            lodash_merge_1.default(o, newK);
        });
        const key = opts.key || '$source';
        const mapFn = opts.mapFn || mergeWithFileContents;
        const keepKey = opts.keepKey || false;
        if (lodash_has_1.default(o, key)) {
            const value = lodash_get_1.default(o, key);
            if (!keepKey) {
                lodash_unset_1.default(o, key);
            }
            o = yield mapFn(o, key, value);
        }
        return o;
    });
}
exports.interpolateDeep = interpolateDeep;
const globalAjv = makeAjv();
class Schema extends validator_1.Validator {
    constructor(opts, key, attributes, globalOptions) {
        opts = { schema: lodash_get_1.default(opts, '$schema', opts) };
        super('schema', opts, key, attributes, globalOptions);
        this.syncano = lodash_get_1.default(this, 'globalOptions.syncano');
        this.ctx = lodash_get_1.default(this, 'globalOptions.ctx');
        this.name = (lodash_get_1.default(this, 'ctx.meta.executor') ||
            lodash_get_1.default(this, 'ctx.meta.name') ||
            'socket/endpoint');
        this.name = `${this.name}/${key}`;
        this.socket = this.name.split('/')[0];
        this.endpoint = this.name.split('/')[1];
        this.parameter = this.name.split('/')[2];
        this.ajv = this.name === `socket/endpoint/${key}` ? makeAjv() : globalAjv;
        this.paramId = this.makeId(this.name);
    }
    test(value, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!validate_js_1.default.isDefined(value)) {
                return true;
            }
            const validate = yield this.getSchema();
            if (!validate(value)) {
                this.msg = this.opts.message ||
                    validate.errors ||
                    'does not match schema';
                return false;
            }
            return true;
        });
    }
    makeId(schemaId) {
        if (this.syncano) {
            return `${this.syncano.endpoint._url(this.socket + '/' + this.endpoint)}${schemaId}/$schema`;
        }
        return `http://local/schemas/${schemaId}/$schema`;
    }
    fetchSocketJSON() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.syncano) {
                return;
            }
            const { instanceName, host } = lodash_get_1.default(this, 'syncano.socket.instance', {});
            if (!instanceName) {
                return;
            }
            const token = this.syncano.socket.instance.token || this.syncano.socket.instance.token;
            if (!token) {
                return;
            }
            const headers = {
                'X-API-KEY': token,
            };
            const url = this.syncano.socket.url(this.socket);
            return new Promise((resolve, reject) => {
                if (!this.syncano) {
                    resolve();
                    return;
                }
                this.syncano.socket.fetch(url, {}, headers)
                    .then((v) => resolve(v))
                    .catch(reject);
            }).then(socketMeta => {
                const socketYml = lodash_get_1.default(socketMeta, ['files', 'socket.yml', 'file']);
                return node_fetch_1.default(socketYml)
                    .then(r => r.buffer())
                    .then(b => js_yaml_1.default.safeLoad(b.toString()))
                    .then((socketJson) => socketJson);
            })
                .catch(e => undefined);
        });
    }
    makeSocketSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            const socketJson = yield this.fetchSocketJSON();
            if (!socketJson) {
                return;
            }
            const socketId = this.makeId(this.socket);
            this.ajv.addSchema(Object.assign({}, (yield interpolateDeep(socketJson)), { $id: socketId }));
        });
    }
    makeEndpointSchema() {
        if (!this.ctx) {
            return;
        }
        const endpointId = this.makeId(`${this.socket}/${this.endpoint}`);
        this.ajv.addSchema(Object.assign({}, lodash_get_1.default(this.ctx, 'meta.metadata', {}), { $id: endpointId }));
    }
    makeSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ajv.addSchema(Object.assign({}, this.opts.schema, { $id: this.paramId }));
            this.makeEndpointSchema();
            try {
                yield this.makeSocketSchema();
            }
            catch (e) {
                if (this.syncano) {
                    this.syncano.logger(`${this.socket}/${this.endpoint}`).error(e);
                }
            }
            return this.ajv.getSchema(this.paramId);
        });
    }
    getSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.ajv.getSchema(this.paramId)) || (yield this.makeSchema());
        });
    }
}
exports.Schema = Schema;
exports.default = (value, opts, key, attributes, globalOptions) => (new Schema(opts, key, attributes, globalOptions).validate(value));
