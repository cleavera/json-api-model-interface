"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Partial_helper_1 = require("../helpers/Partial.helper");
const Collection_service_1 = require("./Collection.service");
const ModelMeta_service_1 = require("./ModelMeta.service");
const RequestMethods_constant_1 = require("../constants/RequestMethods.constant");
const EnumKeys_helper_1 = require("../helpers/EnumKeys.helper");
const FieldType_constant_1 = require("../constants/FieldType.constant");
const Http_service_1 = require("./Http.service");
class Model {
    constructor(promise, root, collection) {
        this.$resolved = false;
        this._apiRoot = root;
        this._collection = collection;
        this.$promise = promise.then(({ headers, body }) => {
            this.$resolved = true;
            this.id = body.id;
            this.type = body.type;
            this.attributes = body.attributes;
            this.link = {};
            this.description = headers.description;
            this.methods = Model.parseAllowHeaders(headers);
            this.cloneAttributes();
            if (body.links) {
                this.parseLinks(body.links);
            }
            return this;
        });
    }
    get label() {
        let isMetaResolved = this._meta && this._meta.$resolved;
        if (!isMetaResolved && (this._collection && !this._collection.getMeta().$resolved)) {
            throw new Error('Meta data needs to be fetched before you can get the label');
        }
        let meta = isMetaResolved ? this._meta : this._collection.getMeta();
        return this.attributes[meta.getLabelField()];
    }
    ;
    serialise() {
        return {
            id: this.id,
            attributes: this.attributes,
            type: this.type
        };
    }
    getMeta() {
        if (!this._meta) {
            this._meta = ModelMeta_service_1.ModelMeta.get(this.link.self.url);
        }
        return this._meta;
    }
    save() {
        if (!(this.methods[RequestMethods_constant_1.RequestMethods.POST] || this.methods[RequestMethods_constant_1.RequestMethods.PUT])) {
            throw new Error('Model does not have the permissions to save');
        }
        let url = this.link.self.url;
        if (this.methods[RequestMethods_constant_1.RequestMethods.PUT]) {
            this.cloneAttributes();
            return Http_service_1.Http.put(url, this.serialise());
        }
        return Http_service_1.Http.post(url, this.serialise());
    }
    remove() {
        if (!this.methods[RequestMethods_constant_1.RequestMethods.DELETE]) {
            throw new Error('Model does not have the permissions to remove');
        }
        let url = this.link.self.url;
        return Http_service_1.Http.remove(url);
    }
    clean() {
        this.attributes = this._attributes;
        this.cloneAttributes();
    }
    static getRoot(url) {
        return Model.get(url, url);
    }
    static fromMeta(meta, root) {
        let model = new Model(meta.$promise.then(() => {
            let response = {
                headers: meta.headers,
                body: {
                    attributes: {},
                    type: meta.type,
                    links: meta.links
                }
            };
            Object.keys(meta.attributes).forEach(attribute => {
                if (meta.attributes[attribute].primaryKey === true) {
                    return;
                }
                if (meta.attributes[attribute].type === FieldType_constant_1.FieldType.string) {
                    response.body.attributes[attribute] = '';
                }
                else {
                    response.body.attributes[attribute] = null;
                }
            });
            return response;
        }), root);
        model._meta = meta;
        return model;
    }
    cloneAttributes() {
        this._attributes = {};
        Object.assign(this._attributes, this.attributes);
    }
    parseLinks(links) {
        let relationships = Object.keys(links);
        relationships.forEach(relationship => {
            if (['self', 'parent'].indexOf(relationship) > -1) {
                this.link[relationship] = Partial_helper_1.$partial(Model.get, this._apiRoot + links[relationship].href, this._apiRoot);
            }
            else {
                this.link[relationship] = Partial_helper_1.$partial(Collection_service_1.Collection.list, this._apiRoot + links[relationship].href, this._apiRoot);
            }
            this.link[relationship].url = this._apiRoot + links[relationship].href;
        });
    }
    static get(url, root) {
        return new Model(Http_service_1.Http.get(url), root);
    }
    static parseAllowHeaders({ allow = '' }) {
        let allowHeaders = allow.replace(/\s/g, '').split(','), out = {};
        EnumKeys_helper_1.$enumKeys(RequestMethods_constant_1.RequestMethods).forEach(method => {
            out[RequestMethods_constant_1.RequestMethods[method]] = allowHeaders.indexOf(method.toUpperCase()) > -1;
        });
        return out;
    }
}
exports.Model = Model;
