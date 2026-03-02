"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const clientes_routes_1 = __importDefault(require("./clientes.routes"));
const coloraciones_routes_1 = __importDefault(require("./coloraciones.routes"));
const reportes_routes_1 = __importDefault(require("./reportes.routes"));
const fotosReportes_routes_1 = __importDefault(require("./fotosReportes.routes"));
const auth_1 = require("../middlewares/auth");
exports.router = (0, express_1.Router)();
// Public routes (no authentication required)
exports.router.use('/auth', auth_routes_1.default);
// Protected routes (authentication required)
exports.router.use('/user', auth_1.requireAuth, user_routes_1.default);
exports.router.use('/clientes', auth_1.requireAuth, clientes_routes_1.default);
exports.router.use('/coloraciones', auth_1.requireAuth, coloraciones_routes_1.default);
exports.router.use('/reportes', auth_1.requireAuth, reportes_routes_1.default);
exports.router.use('/fotos-reportes', auth_1.requireAuth, fotosReportes_routes_1.default);
