"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    const code = err?.statusCode ?? 500;
    const msg = err?.message ?? 'INTERNAL_ERROR';
    res.status(code).json({ error: msg });
}
