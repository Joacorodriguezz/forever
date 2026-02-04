import { z } from 'zod';

const domicilioSchema = z.object({
  calle: z.string({ message: 'La calle es requerida' }).min(1, 'La calle es requerida'),
  numero: z.string({ message: 'El numero es requerido' }).min(1, 'El numero es requerido'),
  piso: z.string().optional(),
  departamento: z.string().optional(),
  localidadId: z.number({ message: 'La localidad es requerida' }).int().positive(),
});

export const createDeportistaSchema = z.object({
  nombre: z
    .string({ message: 'El nombre es requerido' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  apellido: z
    .string({ message: 'El apellido es requerido' })
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  dni: z
    .string({ message: 'El DNI es requerido' })
    .regex(/^\d{7,8}$/, 'El DNI debe tener 7 u 8 digitos'),
  fechaNac: z.string({ message: 'La fecha de nacimiento es requerida' }),
  categoria: z.string().optional(),
  obraSocial: z.string().optional(),
  disciplinaId: z
    .number({ message: 'La disciplina es requerida' })
    .int()
    .positive('ID de disciplina invalido'),
  email: z.string({ message: 'El email es requerido' }).email('Formato de email incorrecto'),
  password: z
    .string({ message: 'La contrasena es requerida' })
    .min(8, 'La contrasena debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contrasena debe tener al menos una mayuscula'),
  domicilio: domicilioSchema,
  telefonos: z.array(z.string()).optional(),
  enfermedadIds: z.array(z.number().int().positive()).optional(),
});

export const updateDeportistaSchema = z.object({
  nombre: z.string().min(2).max(50).optional(),
  apellido: z.string().min(2).max(50).optional(),
  fechaNac: z.string().optional(),
  categoria: z.string().optional(),
  obraSocial: z.string().optional(),
  disciplinaId: z.number().int().positive().optional(),
  domicilio: domicilioSchema.partial().optional(),
  telefonos: z.array(z.string()).optional(),
  enfermedadIds: z.array(z.number().int().positive()).optional(),
});

export const deportistasQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  estado: z.enum(['EN_DEUDA', 'AL_DIA', 'MOROSA', 'INACTIVA']).optional(),
  disciplinaId: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(),
});

export type CreateDeportistaInput = z.infer<typeof createDeportistaSchema>;
export type UpdateDeportistaInput = z.infer<typeof updateDeportistaSchema>;
export type DeportistasQuery = z.infer<typeof deportistasQuerySchema>;
