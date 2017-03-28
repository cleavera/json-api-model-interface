"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function $partial(func, ...bindArgs) {
    return function (...args) {
        return func.apply(this, bindArgs.concat(args));
    };
}
exports.$partial = $partial;
