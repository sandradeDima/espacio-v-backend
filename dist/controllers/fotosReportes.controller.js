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
exports.getAllFotosReportes = getAllFotosReportes;
exports.getFotoReporteById = getFotoReporteById;
exports.getFotosByReporte = getFotosByReporte;
exports.createFotoReporte = createFotoReporte;
exports.updateFotoReporte = updateFotoReporte;
exports.deleteFotoReporte = deleteFotoReporte;
exports.deleteFotosByReporte = deleteFotosByReporte;
const FotosReportesService = __importStar(require("../services/fotosReportes.service"));
async function getAllFotosReportes(req, res) {
    const mensaje = await FotosReportesService.getAllFotosReportes();
    res.status(mensaje.code).json(mensaje);
}
async function getFotoReporteById(req, res) {
    const id = parseInt(req.params.id);
    const mensaje = await FotosReportesService.getFotoReporteById(id);
    res.status(mensaje.code).json(mensaje);
}
async function getFotosByReporte(req, res) {
    const reporteId = parseInt(req.params.reporteId);
    const mensaje = await FotosReportesService.getFotosByReporte(reporteId);
    res.status(mensaje.code).json(mensaje);
}
async function createFotoReporte(req, res) {
    const { reporteId, filename } = req.body;
    const mensaje = await FotosReportesService.createFotoReporte(reporteId, filename);
    res.status(mensaje.code).json(mensaje);
}
async function updateFotoReporte(req, res) {
    const id = parseInt(req.params.id);
    const { reporteId, filename } = req.body;
    const mensaje = await FotosReportesService.updateFotoReporte(id, reporteId, filename);
    res.status(mensaje.code).json(mensaje);
}
async function deleteFotoReporte(req, res) {
    const id = parseInt(req.params.id);
    const mensaje = await FotosReportesService.deleteFotoReporte(id);
    res.status(mensaje.code).json(mensaje);
}
async function deleteFotosByReporte(req, res) {
    const reporteId = parseInt(req.params.reporteId);
    const mensaje = await FotosReportesService.deleteFotosByReporte(reporteId);
    res.status(mensaje.code).json(mensaje);
}
