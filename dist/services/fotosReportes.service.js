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
const FotosReportesRepo = __importStar(require("../repositories/fotosReportes.repo"));
const ReportesRepo = __importStar(require("../repositories/reportes.repo"));
const MensajeApi_1 = require("../types/MensajeApi");
async function getAllFotosReportes() {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const fotos = await FotosReportesRepo.findAll();
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Fotos obtenidas correctamente';
        mensaje.data = fotos;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener fotos';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function getFotoReporteById(id) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const foto = await FotosReportesRepo.findById(id);
        if (!foto) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Foto no encontrada';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Foto obtenida correctamente';
        mensaje.data = foto;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener foto';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function getFotosByReporte(reporteId) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const fotos = await FotosReportesRepo.findByReporte(reporteId);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Fotos del reporte obtenidas correctamente';
        mensaje.data = fotos;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener fotos del reporte';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function createFotoReporte(reporteId, filename) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        // Validate reporte exists
        const reporte = await ReportesRepo.findById(reporteId);
        if (!reporte) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Reporte no encontrado';
            return mensaje;
        }
        const foto = await FotosReportesRepo.create(reporteId, filename);
        mensaje.code = 201;
        mensaje.error = false;
        mensaje.message = 'Foto creada correctamente';
        mensaje.data = foto;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al crear foto';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function updateFotoReporte(id, reporteId, filename) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        // Validate foto exists
        const existingFoto = await FotosReportesRepo.findById(id);
        if (!existingFoto) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Foto no encontrada';
            return mensaje;
        }
        // Validate reporte exists
        const reporte = await ReportesRepo.findById(reporteId);
        if (!reporte) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Reporte no encontrado';
            return mensaje;
        }
        const foto = await FotosReportesRepo.update(id, reporteId, filename);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Foto actualizada correctamente';
        mensaje.data = foto;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al actualizar foto';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function deleteFotoReporte(id) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const deleted = await FotosReportesRepo.remove(id);
        if (!deleted) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Foto no encontrada';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Foto eliminada correctamente';
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al eliminar foto';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function deleteFotosByReporte(reporteId) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const deletedCount = await FotosReportesRepo.removeByReporte(reporteId);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = `${deletedCount} foto(s) eliminada(s) correctamente`;
        mensaje.data = { deletedCount };
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al eliminar fotos del reporte';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
