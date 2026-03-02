"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.refresh = refresh;
exports.logoutUser = logoutUser;
exports.logoutAllSessions = logoutAllSessions;
const UserRepo = __importStar(require("../repositories/user.repo"));
const RefreshTokensRepo = __importStar(require("../repositories/refreshTokens.repo"));
const password_1 = require("../utils/password");
const tokens_1 = require("../utils/tokens");
const MensajeApi_1 = require("../types/MensajeApi");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../config/logger");
async function registerUser(email, password, name) {
    try {
        let mensaje = new MensajeApi_1.MensajeApi();
        //search for user by email
        let user = await UserRepo.findByEmail(email);
        if (user) {
            mensaje.code = 400;
            mensaje.error = true;
            mensaje.message = 'El usuario ya existe';
            return mensaje;
        }
        //hash password
        const passwordHash = await (0, password_1.hash)(password);
        //create user
        user = await UserRepo.createUser(email, passwordHash, name, 1);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Usuario registrado correctamente';
        mensaje.data = user;
        return mensaje;
    }
    catch (error) {
        let mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al registrar el usuario';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function loginUser(email, password) {
    try {
        let mensaje = new MensajeApi_1.MensajeApi();
        //search for user by email
        let user = await UserRepo.findByEmail(email);
        if (!user) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Credenciales incorrectas';
            return mensaje;
        }
        logger_1.logger.info('Usuario encontrado');
        logger_1.logger.info(user);
        logger_1.logger.info('Contraseña: ' + password);
        logger_1.logger.info('Contraseña hash: ' + user.passwordHash);
        //compare password
        const validPassword = await (0, password_1.compare)(password, user.passwordHash);
        logger_1.logger.info('Contraseña válida: ' + validPassword);
        if (!validPassword) {
            mensaje.code = 400;
            mensaje.error = true;
            mensaje.message = 'Credenciales incorrectas';
            return mensaje;
        }
        logger_1.logger.info('Usuario encontrado y contraseña correcta');
        const accessToken = (0, tokens_1.signAccess)({ sub: user.id, role: user.role });
        const refreshToken = (0, tokens_1.signRefresh)({ sub: user.id, role: user.role });
        logger_1.logger.info('Tokens generados');
        const decodedRefreshToken = jsonwebtoken_1.default.decode(accessToken);
        const exp = decodedRefreshToken?.exp ? new Date(decodedRefreshToken.exp * 1000) : new Date(Date.now() + 7 * 24 * 3600 * 1000);
        logger_1.logger.info('Expiración del token de acceso: ' + exp);
        await RefreshTokensRepo.storeRefreshToken(user.id, refreshToken, exp);
        logger_1.logger.info('Token de refresco almacenado');
        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Inicio de sesión exitoso';
        mensaje.data = { accessToken, refreshToken, user: userData };
        return mensaje;
    }
    catch (error) {
        let mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al iniciar sesión';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function refresh(oldRefreshToken, userId) {
    try {
        let mensaje = new MensajeApi_1.MensajeApi();
        //consume refresh token
        const used = await RefreshTokensRepo.consumeRefreshToken(userId, oldRefreshToken);
        if (!used || used.expiresAt < new Date()) {
            mensaje.code = 401;
            mensaje.error = true;
            mensaje.message = 'Token de refresco invalido';
            return mensaje;
        }
        //get user by id
        const user = await UserRepo.findById(userId);
        if (!user) {
            mensaje.code = 400;
            mensaje.error = true;
            mensaje.message = 'Usuario no encontrado';
            return mensaje;
        }
        // Generate new tokens
        const accessToken = (0, tokens_1.signAccess)({ sub: userId, role: user.role });
        const refreshToken = (0, tokens_1.signRefresh)({ sub: userId, role: user.role });
        // Store the new refresh token
        const decodedRefreshToken = jsonwebtoken_1.default.decode(refreshToken);
        const exp = decodedRefreshToken?.exp ? new Date(decodedRefreshToken.exp * 1000) : new Date(Date.now() + 7 * 24 * 3600 * 1000);
        await RefreshTokensRepo.storeRefreshToken(userId, refreshToken, exp);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Token de refresco exitoso';
        mensaje.data = { accessToken, refreshToken };
        return mensaje;
    }
    catch (error) {
        let mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al refrescar el token';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function logoutUser(refreshToken, userId) {
    try {
        let mensaje = new MensajeApi_1.MensajeApi();
        // Verify the refresh token is valid before revoking
        try {
            const payload = (0, tokens_1.verifyToken)(refreshToken);
            if (Number(payload.sub) !== userId) {
                mensaje.code = 401;
                mensaje.error = true;
                mensaje.message = 'Token no válido para este usuario';
                return mensaje;
            }
        }
        catch (error) {
            mensaje.code = 401;
            mensaje.error = true;
            mensaje.message = 'Token de refresco inválido';
            return mensaje;
        }
        // Revoke the specific refresh token
        const revoked = await RefreshTokensRepo.revokeRefreshToken(userId, refreshToken);
        if (!revoked) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Token de refresco no encontrado';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Sesión cerrada exitosamente';
        return mensaje;
    }
    catch (error) {
        let mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al cerrar sesión';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function logoutAllSessions(userId) {
    try {
        let mensaje = new MensajeApi_1.MensajeApi();
        // Revoke all refresh tokens for the user
        await RefreshTokensRepo.revokeAllRefreshTokens(userId);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Todas las sesiones han sido cerradas exitosamente';
        return mensaje;
    }
    catch (error) {
        let mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al cerrar todas las sesiones';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
