"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFotoReporteSchema = exports.createFotoReporteSchema = void 0;
const zod_1 = require("zod");
exports.createFotoReporteSchema = zod_1.z.object({
    reporteId: zod_1.z.number().int().positive(),
    filename: zod_1.z.string().min(1, 'El nombre del archivo es requerido').max(255)
});
exports.updateFotoReporteSchema = zod_1.z.object({
    reporteId: zod_1.z.number().int().positive(),
    filename: zod_1.z.string().min(1, 'El nombre del archivo es requerido').max(255)
});
