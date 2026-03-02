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
exports.getAllReportes = getAllReportes;
exports.getReporteById = getReporteById;
exports.getReportesByCliente = getReportesByCliente;
exports.createReporte = createReporte;
exports.updateReporte = updateReporte;
exports.deleteReporte = deleteReporte;
exports.getReportesByDateRange = getReportesByDateRange;
exports.createReporteCompleto = createReporteCompleto;
exports.generarDocumento = generarDocumento;
const params_1 = require("./params");
const ReportesService = __importStar(require("../services/reportes.service"));
const logger_1 = require("../config/logger");
async function getAllReportes(req, res) {
    const mensaje = await ReportesService.getAllReportes();
    res.status(mensaje.code).json(mensaje);
}
async function getReporteById(req, res) {
    const id = (0, params_1.getParamInt)(req.params.id);
    const mensaje = await ReportesService.getReporteById(id);
    res.status(mensaje.code).json(mensaje);
}
async function getReportesByCliente(req, res) {
    const clienteId = (0, params_1.getParamInt)(req.params.clienteId);
    const mensaje = await ReportesService.getReportesByCliente(clienteId);
    res.status(mensaje.code).json(mensaje);
}
async function createReporte(req, res) {
    const { clienteId, fechaServicio, horaServicio, coloracionId, formula, observaciones, precio } = req.body;
    logger_1.logger.info("horaServicio", horaServicio);
    logger_1.logger.info("fechaServicio", fechaServicio);
    const mensaje = await ReportesService.createReporte(clienteId, new Date(fechaServicio), horaServicio, coloracionId, formula, observaciones, precio);
    res.status(mensaje.code).json(mensaje);
}
async function updateReporte(req, res) {
    const id = (0, params_1.getParamInt)(req.params.id);
    const { clienteId, coloracion, formula, observaciones, precio, idReporte } = req.body;
    const mensaje = await ReportesService.updateReporte(id, clienteId, coloracion, formula, observaciones, precio);
    res.status(mensaje.code).json(mensaje);
}
async function deleteReporte(req, res) {
    const id = (0, params_1.getParamInt)(req.params.id);
    const mensaje = await ReportesService.deleteReporte(id);
    res.status(mensaje.code).json(mensaje);
}
async function getReportesByDateRange(req, res) {
    const { startDate, endDate } = req.query;
    const mensaje = await ReportesService.getReportesByDateRange(new Date(startDate), new Date(endDate));
    res.status(mensaje.code).json(mensaje);
}
async function createReporteCompleto(req, res) {
    const { clienteId, fechaServicio, horaServicio, coloracionId, formula, observaciones, precio } = req.body;
    const fotos = req.files ?? [];
    const mensaje = await ReportesService.createReporteCompleto(Number(clienteId), new Date(fechaServicio), horaServicio, Number(coloracionId), formula, observaciones ?? 'Sin observaciones', Number(precio), fotos);
    res.status(mensaje.code).json(mensaje);
}
async function generarDocumento(req, res) {
    const { reportesIds, documentType } = req.body;
    const resultado = await ReportesService.generarDocumento(reportesIds, documentType);
    if (!resultado.ok) {
        res.status(resultado.mensaje.code).json(resultado.mensaje);
        return;
    }
    res.setHeader('Content-Type', resultado.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${resultado.filename}"`);
    res.send(resultado.buffer);
}
