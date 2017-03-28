"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webworker_http_1 = require("webworker-http");
const Model_service_1 = require("./Model.service");
const ModelMeta_service_1 = require("./ModelMeta.service");
class Collection {
    constructor(promise, root, url) {
        this.$resolved = false;
        this._selfLink = url;
        this._apiRoot = root;
        this.parseResponse(promise);
    }
    getTemplate() {
        return Model_service_1.Model.fromMeta(this.getMeta(), this._apiRoot);
    }
    getMeta() {
        if (!this._meta) {
            this._meta = ModelMeta_service_1.ModelMeta.get(this._selfLink);
        }
        return this._meta;
    }
    get(id, type) {
        return this.data.filter((model) => {
            if (type) {
                return model.type === type && model.id === id;
            }
            return model.id === id;
        })[0].link.self();
    }
    reload() {
        this.$resolved = false;
        this.parseResponse(webworker_http_1.$fetch(this._selfLink));
    }
    parseResponse(promise) {
        this.$promise = promise.then(({ headers, body }) => {
            this.$resolved = true;
            this.description = headers.description;
            this.data = body.map(data => {
                return new Model_service_1.Model(Promise.resolve({ headers: headers, body: data }), this._apiRoot, this);
            });
            return this;
        });
    }
    static list(url, root) {
        return new Collection(webworker_http_1.$fetch(url), root, url);
    }
}
exports.Collection = Collection;
