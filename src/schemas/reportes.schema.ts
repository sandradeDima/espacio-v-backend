import { z } from 'zod';

export const createReporteSchema = z.object({
    clienteId: z.number().int().positive(),
    fechaServicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (formato YYYY-MM-DD)'),
    horaServicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Hora inválida (formato HH:MM o HH:MM:SS)'),
    coloracionId: z.number().int().positive(),
    formula: z.string().min(1, 'La fórmula es requerida').max(255),
    observaciones: z.string().max(255).default('Sin observaciones'),
    precio: z.number().positive('El precio debe ser mayor a 0')
});

export const updateReporteSchema = z.object({
    idReporte: z.number().int().positive(),
    coloracion: z.number().int().positive(),
    clienteId: z.number().int().positive(),
    fechaServicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (formato YYYY-MM-DD)').optional(),
    horaServicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Hora inválida (formato HH:MM o HH:MM:SS)').optional(),
    precio: z.number().positive('El precio debe ser mayor a 0'),
    formula: z.string().min(1, 'La fórmula es requerida').max(255),
    observaciones: z.string().max(255).default('Sin observaciones'),
});


export const createReporteCompletoSchema = z.object({
    clienteId: z.number().int().positive(),
    fechaServicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida (formato YYYY-MM-DD)'),
    horaServicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Hora inválida (formato HH:MM o HH:MM:SS)'),
    coloracionId: z.number().int().positive(),
    formula: z.string().min(1, 'La fórmula es requerida').max(255),
    observaciones: z.string().max(255).default('Sin observaciones'),
    precio: z.number().positive('El precio debe ser mayor a 0'),
    fotos: z.array(z.file())
})

export const generarDocumentoSchema = z.object({
    reportesIds: z.array(z.number().int().positive()),
    documentType: z.enum(["pdf","excel"])
})
export type CreateReporteDTO = z.infer<typeof createReporteSchema>;
export type UpdateReporteDTO = z.infer<typeof updateReporteSchema>;
