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
const ColoracionesRepo = __importStar(require("../repositories/coloraciones.repo"));
const MensajeApi_1 = require("../types/MensajeApi");
async function getAllColoraciones() {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const coloraciones = await ColoracionesRepo.findAll();
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Coloraciones obtenidas correctamente';
        mensaje.data = coloraciones;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener coloraciones';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function getColoracionById(id) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const coloracion = await ColoracionesRepo.findById(id);
        if (!coloracion) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Coloración no encontrada';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Coloración obtenida correctamente';
        mensaje.data = coloracion;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al obtener coloración';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function createColoracion(nombre, descripcion) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const coloracion = await ColoracionesRepo.create(nombre, descripcion);
        mensaje.code = 201;
        mensaje.error = false;
        mensaje.message = 'Coloración creada correctamente';
        mensaje.data = coloracion;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al crear coloración';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function updateColoracion(id, nombre, descripcion) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const coloracion = await ColoracionesRepo.update(id, nombre, descripcion);
        if (!coloracion) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Coloración no encontrada';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Coloración actualizada correctamente';
        mensaje.data = coloracion;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al actualizar coloración';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function deleteColoracion(id) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        const deleted = await ColoracionesRepo.remove(id);
        if (!deleted) {
            mensaje.code = 404;
            mensaje.error = true;
            mensaje.message = 'Coloración no encontrada';
            return mensaje;
        }
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Coloración eliminada correctamente';
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al eliminar coloración';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
async function searchColoraciones(query) {
    try {
        const mensaje = new MensajeApi_1.MensajeApi();
        console.log(query);
        const coloraciones = await ColoracionesRepo.search(query);
        mensaje.code = 200;
        mensaje.error = false;
        mensaje.message = 'Búsqueda realizada correctamente';
        mensaje.data = coloraciones;
        return mensaje;
    }
    catch (error) {
        const mensaje = new MensajeApi_1.MensajeApi();
        mensaje.code = 500;
        mensaje.error = true;
        mensaje.message = 'Error al buscar coloraciones';
        mensaje.technicalMessage = error instanceof Error ? error.message : 'Error desconocido';
        return mensaje;
    }
}
