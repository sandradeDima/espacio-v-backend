import { z } from 'zod';

export const createColoracionSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').max(255),
    descripcion: z.string().min(1, 'La descripción es requerida').max(255),
    precio: z.union([z.number().nonnegative('El precio no puede ser negativo'), z.null()]).optional()
});

export const updateColoracionSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').max(255),
    descripcion: z.string().min(1, 'La descripción es requerida').max(255),
    precio: z.union([z.number().nonnegative('El precio no puede ser negativo'), z.null()]).optional()
});

export type CreateColoracionDTO = z.infer<typeof createColoracionSchema>;
export type UpdateColoracionDTO = z.infer<typeof updateColoracionSchema>;
