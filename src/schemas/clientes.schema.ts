import { z } from 'zod';

export const createClienteSchema = z.object({
    nombre: z.string().trim().min(1, 'El nombre es requerido').max(255),
    email: z.union([z.string().trim().email('Email inválido').max(255), z.literal(''), z.null()]).optional(),
    telefono: z
      .string()
      .trim()
      .min(1, 'El teléfono es requerido')
      .max(255)
      .regex(/^\d+$/, 'El teléfono solo debe contener números'),
    comentarios: z.union([z.string().trim().max(500), z.literal(''), z.null()]).optional()
});

export const updateClienteSchema = z.object({
    nombre: z.string().trim().min(1, 'El nombre es requerido').max(255),
    email: z.union([z.string().trim().email('Email inválido').max(255), z.literal(''), z.null()]).optional(),
    telefono: z
      .string()
      .trim()
      .min(1, 'El teléfono es requerido')
      .max(255)
      .regex(/^\d+$/, 'El teléfono solo debe contener números'),
    comentarios: z.union([z.string().trim().max(500), z.literal(''), z.null()]).optional()
});

export type CreateClienteDTO = z.infer<typeof createClienteSchema>;
export type UpdateClienteDTO = z.infer<typeof updateClienteSchema>;

export const buscadorClientesSchema = z.object({
    page: z.number().min(1, 'La página debe ser mayor o igual a 1'),
    size: z.number().min(1, 'El tamaño debe ser mayor o igual a 1'),
    clientName: z.string().optional(),
    clientEmail: z.string().optional(),
    clientPhone: z.string().optional(),
})
