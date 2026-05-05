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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllColoraciones = getAllColoraciones;
exports.getColoracionById = getColoracionById;
exports.createColoracion = createColoracion;
exports.updateColoracion = updateColoracion;
exports.deleteColoracion = deleteColoracion;
exports.searchColoraciones = searchColoraciones;
const params_1 = require("./params");
const ColoracionesService = __importStar(require("../services/coloraciones.service"));
const logger_1 = require("../config/logger");
async function getAllColoraciones(req, res) {
    const mensaje = await ColoracionesService.getAllColoraciones();
    res.status(mensaje.code).json(mensaje);
}
async function getColoracionById(req, res) {
    const id = (0, params_1.getParamInt)(req.params.id);
    const mensaje = await ColoracionesService.getColoracionById(id);
    res.status(mensaje.code).json(mensaje);
}
async function createColoracion(req, res) {
    const { nombre, descripcion, precio } = req.body;
    const mensaje = await ColoracionesService.createColoracion(nombre, descripcion, precio);
    res.status(mensaje.code).json(mensaje);
}
async function updateColoracion(req, res) {
    const id = (0, params_1.getParamInt)(req.params.id);
    const { nombre, descripcion, precio } = req.body;
    const mensaje = await ColoracionesService.updateColoracion(id, nombre, descripcion, precio);
    res.status(mensaje.code).json(mensaje);
}
async function deleteColoracion(req, res) {
    const id = (0, params_1.getParamInt)(req.params.id);
    const mensaje = await ColoracionesService.deleteColoracion(id);
    res.status(mensaje.code).json(mensaje);
}
async function searchColoraciones(req, res) {
    logger_1.logger.info("llega a searchColoraciones");
    const query = req.query.query || '';
    logger_1.logger.info(query);
    const mensaje = await ColoracionesService.searchColoraciones(query);
    res.status(mensaje.code).json(mensaje);
}
