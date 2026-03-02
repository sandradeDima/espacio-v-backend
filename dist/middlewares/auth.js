"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const tokens_1 = require("../utils/tokens");
const logger_1 = require("../config/logger");
function requireAuth(req, res, next) {
    logger_1.logger.info(`Auth middleware called for: ${req.method} ${req.path}`);
    const header = req.headers.authorization;
    logger_1.logger.info(`Authorization header: ${header || 'NOT PROVIDED'}`);
    if (!header) {
        logger_1.logger.warn('No authorization header provided');
        res.status(401).json({
            code: 401,
            error: true,
            message: 'No se proporcionó token de autenticación'
        });
        return;
    }
    if (!header.startsWith('Bearer ')) {
        res.status(401).json({
            code: 401,
            error: true,
            message: 'Formato de token inválido. Use: Bearer <token>'
        });
        return;
    }
    try {
        const token = header.slice(7);
        const payload = (0, tokens_1.verifyToken)(token);
        req.user = { sub: Number(payload.sub), role: payload.role };
        next();
    }
    catch (error) {
        res.status(401).json({
            code: 401,
            error: true,
            message: 'Token inválido o expirado'
        });
        return;
    }
}
