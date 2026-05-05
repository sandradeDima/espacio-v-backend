"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarDocumentoSchema = exports.createReporteCompletoSchema = exports.updateReporteSchema = exports.createReporteSchema = void 0;
const zod_1 = require("zod");
exports.createReporteSchema = zod_1.z.object({
    clienteId: zod_1.z.number().int().positive(),
    fechaServicio: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (formato YYYY-MM-DD)'),
    horaServicio: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Hora inválida (formato HH:MM o HH:MM:SS)'),
    coloracionId: zod_1.z.number().int().positive(),
    formula: zod_1.z.string().min(1, 'La fórmula es requerida').max(255),
    observaciones: zod_1.z.string().max(255).default('Sin observaciones'),
    precio: zod_1.z.number().nonnegative('El precio no puede ser negativo')
});
exports.updateReporteSchema = zod_1.z.object({
    idReporte: zod_1.z.number().int().positive(),
    coloracion: zod_1.z.number().int().positive(),
    clienteId: zod_1.z.number().int().positive(),
    fechaServicio: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (formato YYYY-MM-DD)').optional(),
    horaServicio: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Hora inválida (formato HH:MM o HH:MM:SS)').optional(),
    precio: zod_1.z.number().nonnegative('El precio no puede ser negativo'),
    formula: zod_1.z.string().min(1, 'La fórmula es requerida').max(255),
    observaciones: zod_1.z.string().max(255).default('Sin observaciones'),
});
exports.createReporteCompletoSchema = zod_1.z.object({
    clienteId: zod_1.z.number().int().positive(),
    fechaServicio: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (formato YYYY-MM-DD)'),
    horaServicio: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Hora inválida (formato HH:MM o HH:MM:SS)'),
    coloracionId: zod_1.z.number().int().positive(),
    formula: zod_1.z.string().min(1, 'La fórmula es requerida').max(255),
    observaciones: zod_1.z.string().max(255).default('Sin observaciones'),
    precio: zod_1.z.number().nonnegative('El precio no puede ser negativo'),
    fotos: zod_1.z.array(zod_1.z.file())
});
exports.generarDocumentoSchema = zod_1.z.object({
    reportesIds: zod_1.z.array(zod_1.z.number().int().positive()),
    documentType: zod_1.z.enum(["pdf", "excel"])
});
