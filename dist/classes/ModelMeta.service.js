"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FieldMeta_service_1 = require("./FieldMeta.service");
const Http_service_1 = require("./Http.service");
class ModelMeta {
    constructor(promise) {
        this.$resolved = false;
        this.$promise = promise.then(({ headers, body }) => {
            this.$resolved = true;
            this.type = body.type;
            this.attributes = ModelMeta.parseAttributes(body.attributes);
            this.links = body.links;
            this.headers = headers;
            return this;
        });
    }
    getLabelField() {
        return Object.keys(this.attributes).filter(attribute => this.attributes[attribute].label)[0];
    }
    static get(url) {
        return new ModelMeta(Http_service_1.Http.options(url));
    }
    static parseAttributes(attributes) {
        let out = {};
        Object.keys(attributes).forEach(attribute => {
            out[attribute] = new FieldMeta_service_1.FieldMeta(attributes[attribute]);
        });
        return out;
    }
}
exports.ModelMeta = ModelMeta;
