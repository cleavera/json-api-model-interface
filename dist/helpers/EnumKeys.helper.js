"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function $enumKeys(enumerable) {
    return Object.keys(enumerable).filter(enumMember => {
        return isNaN(parseInt(enumMember, 10));
    });
}
exports.$enumKeys = $enumKeys;
