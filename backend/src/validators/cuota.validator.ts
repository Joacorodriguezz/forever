import { z } from 'zod';

// CU04 - Asignar Cuota
export const asignarCuotaSchema = z.object({
  deportistaId: z
    .number({ message: 'El deportista es requerido' })
    .int()
    .positive('ID de deportista invalido'),
  nroCuota: z
    .number({ message: 'El numero de cuota es requerido' })
    .int()
    .positive('Numero de cuota invalido'),
  monto: z
    .number({ message: 'El monto es requerido' })
    .positive('El monto debe ser mayor a 0'),
  fechaEmision: z.string({ message: 'La fecha de emision es requerida' }),
  fechaVencimiento: z.string({ message: 'La fecha de vencimiento es requerida' }),
  disciplinaId: z
    .number({ message: 'La disciplina es requerida' })
    .int()
    .positive('ID de disciplina invalido'),
});

// CU05 - Actualizar Cuotas
export const updateCuotaSchema = z.object({
  monto: z.number().positive('El monto debe ser mayor a 0').optional(),
  fechaVencimiento: z.string().optional(),
  periodicidad: z.enum(['MENSUAL', 'ANUAL']).optional(),
});

export const cuotasQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  estado: z.enum(['PAGADA', 'PENDIENTE', 'VENCIDA']).optional(),
  deportistaId: z.string().regex(/^\d+$/).transform(Number).optional(),
  disciplinaId: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export type AsignarCuotaInput = z.infer<typeof asignarCuotaSchema>;
export type UpdateCuotaInput = z.infer<typeof updateCuotaSchema>;
export type CuotasQuery = z.infer<typeof cuotasQuerySchema>;
