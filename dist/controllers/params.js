"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParamString = getParamString;
exports.getParamInt = getParamInt;
function getParamString(value) {
    if (Array.isArray(value)) {
        return value[0] ?? '';
    }
    return value ?? '';
}
function getParamInt(value) {
    return Number.parseInt(getParamString(value), 10);
}
