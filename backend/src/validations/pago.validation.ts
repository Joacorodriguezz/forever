import { z } from 'zod';

export const PagarCuotaSchema = z.object({
  cuotaId: z.coerce.number().int().positive('El ID de la cuota debe ser un número positivo'),
  medioDePago: z.enum(['EFECTIVO', 'CBU'], {
    errorMap: () => ({ message: 'El medio de pago debe ser EFECTIVO o CBU' }),
  }),
});

