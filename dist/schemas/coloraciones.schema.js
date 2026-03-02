"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateColoracionSchema = exports.createColoracionSchema = void 0;
const zod_1 = require("zod");
exports.createColoracionSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1, 'El nombre es requerido').max(255),
    descripcion: zod_1.z.string().min(1, 'La descripción es requerida').max(255)
});
exports.updateColoracionSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1, 'El nombre es requerido').max(255),
    descripcion: zod_1.z.string().min(1, 'La descripción es requerida').max(255)
});
