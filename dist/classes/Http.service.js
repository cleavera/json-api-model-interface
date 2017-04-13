"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("webworker-http/dist");
class $Http {
    constructor() {
        this.errorHandlers = [];
    }
    addErrorHandler(handler) {
        this.errorHandlers.push(handler);
    }
    get(url) {
        return this.errorHandlers.reduce((promise, handler) => {
            return promise.catch(handler);
        }, dist_1.$fetch(url));
    }
    put(url, body) {
        return dist_1.Http.getHttpWorker().put(url, body);
    }
    post(url, body) {
        return dist_1.Http.getHttpWorker().post(url, body);
    }
    remove(url) {
        return dist_1.Http.getHttpWorker().remove(url);
    }
    options(url) {
        return dist_1.Http.getHttpWorker().options(url);
    }
}
exports.$Http = $Http;
exports.Http = new $Http();
