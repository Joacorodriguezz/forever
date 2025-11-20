import { z } from 'zod';

const mesEnum = z.enum([
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
]);

// CU04 - Asignar Cuota
export const AsignarCuotaSchema = z.object({
  socioId: z.coerce.number().int().positive('ID de socio inválido'),
  mes: mesEnum,
  monto: z.coerce.number().positive('El monto debe ser mayor a 0'),
  fechaVencimiento: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, { message: 'Fecha de vencimiento inválida' }),
  actividadId: z.coerce.number().int().positive().optional(),
});

// CU05 - Actualizar Cuota
export const ActualizarCuotaSchema = z.object({
  monto: z.coerce.number().positive('El monto debe ser mayor a 0').optional(),
  fechaVencimiento: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, { message: 'Fecha de vencimiento inválida' }).optional(),
  actividadId: z.coerce.number().int().positive().optional(),
}).refine((data) => {
  return data.monto !== undefined || data.fechaVencimiento !== undefined || data.actividadId !== undefined;
}, {
  message: 'Debe proporcionar al menos un campo para actualizar',
});

