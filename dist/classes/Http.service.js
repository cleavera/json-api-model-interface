"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("webworker-http/dist");
class $Http {
    constructor() {
        this.errorHandlers = [];
        this.headers = {
            'Content-Type': 'application/json'
        };
    }
    addHeader(key, value) {
        this.headers[key] = value;
    }
    addErrorHandler(handler) {
        this.errorHandlers.push(handler);
    }
    get(url) {
        return this.errorHandlers.reduce((promise, handler) => {
            return promise.catch(handler);
        }, dist_1.$fetch(url, this.headers));
    }
    put(url, body) {
        return dist_1.Http.getHttpWorker().put(url, body, this.headers);
    }
    post(url, body) {
        return dist_1.Http.getHttpWorker().post(url, body, this.headers);
    }
    remove(url) {
        return dist_1.Http.getHttpWorker().remove(url, this.headers);
    }
    options(url) {
        return dist_1.Http.getHttpWorker().options(url, this.headers);
    }
}
exports.$Http = $Http;
exports.Http = new $Http();
