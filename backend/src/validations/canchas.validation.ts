import { z } from 'zod';

export const createCanchaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().optional().nullable(),
  actividadId: z.preprocess((v) => Number(v), z.number().int().positive('actividadId inválido')),
  activa: z.boolean().optional(),
});

export const updateCanchaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').optional(),
  descripcion: z.string().optional().nullable(),
  activa: z.boolean().optional(),
});


