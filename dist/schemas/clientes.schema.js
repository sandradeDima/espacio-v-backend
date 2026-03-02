"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buscadorClientesSchema = exports.updateClienteSchema = exports.createClienteSchema = void 0;
const zod_1 = require("zod");
exports.createClienteSchema = zod_1.z.object({
    nombre: zod_1.z.string().trim().min(1, 'El nombre es requerido').max(255),
    email: zod_1.z.union([zod_1.z.string().trim().email('Email inválido').max(255), zod_1.z.literal(''), zod_1.z.null()]).optional(),
    telefono: zod_1.z
        .string()
        .trim()
        .min(1, 'El teléfono es requerido')
        .max(255)
        .regex(/^\d+$/, 'El teléfono solo debe contener números')
});
exports.updateClienteSchema = zod_1.z.object({
    nombre: zod_1.z.string().trim().min(1, 'El nombre es requerido').max(255),
    email: zod_1.z.union([zod_1.z.string().trim().email('Email inválido').max(255), zod_1.z.literal(''), zod_1.z.null()]).optional(),
    telefono: zod_1.z
        .string()
        .trim()
        .min(1, 'El teléfono es requerido')
        .max(255)
        .regex(/^\d+$/, 'El teléfono solo debe contener números')
});
exports.buscadorClientesSchema = zod_1.z.object({
    page: zod_1.z.number().min(1, 'La página debe ser mayor o igual a 1'),
    size: zod_1.z.number().min(1, 'El tamaño debe ser mayor o igual a 1'),
    clientName: zod_1.z.string().optional(),
    clientEmail: zod_1.z.string().optional(),
    clientPhone: zod_1.z.string().optional(),
});
