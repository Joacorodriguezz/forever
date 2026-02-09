import { z } from 'zod';

const adultoResponsableSchema = z.object({
  nombre: z.string({ message: 'El nombre del adulto responsable es requerido' }).min(2).max(50),
  apellido: z.string({ message: 'El apellido del adulto responsable es requerido' }).min(2).max(50),
  dni: z
    .string({ message: 'El DNI del adulto responsable es requerido' })
    .transform((s) => s.replace(/\D/g, ''))
    .refine((s) => /^\d{7,8}$/.test(s), { message: 'El DNI del adulto responsable debe tener 7 u 8 dígitos' }),
  email: z.string({ message: 'El email del adulto responsable es requerido' }).email(),
  telefono: z.string({ message: 'El teléfono del adulto responsable es requerido' }).min(1),
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
    .transform((s) => s.replace(/\D/g, ''))
    .refine((s) => /^\d{7,8}$/.test(s), { message: 'El DNI debe tener 7 u 8 digitos' }),
  fechaNac: z
    .string({ message: 'La fecha de nacimiento es requerida' })
    .transform((s) => {
      const t = s.trim();
      const dmy = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
      return t;
    }),
  generoId: z.coerce.number({ message: 'El género es requerido' }).int().positive(),
  categoriaId: z.coerce.number({ message: 'La categoría es requerida' }).int().positive(),
  subcategoriaId: z.coerce.number().int().positive().optional(),
  obraSocial: z.string().optional(),
  disciplinaId: z
    .coerce
    .number({ message: 'La disciplina es requerida' })
    .int()
    .positive('ID de disciplina invalido'),
  email: z.string({ message: 'El email es requerido' }).email('Formato de email incorrecto'),
  password: z
    .string({ message: 'La contrasena es requerida' })
    .min(6, 'La contrasena debe tener al menos 6 caracteres'),
  telefonos: z.string().optional(),
  enfermedades: z.string().optional(),
  adultoResponsable: adultoResponsableSchema.optional(),
});

export const updateDeportistaSchema = z.object({
  nombre: z.string().min(2).max(50).optional(),
  apellido: z.string().min(2).max(50).optional(),
  fechaNac: z.string().optional(),
  generoId: z.number().int().positive().optional(),
  categoriaId: z.number().int().positive().optional(),
  subcategoriaId: z.number().int().positive().nullable().optional(),
  obraSocial: z.string().optional(),
  disciplinaId: z.number().int().positive().optional(),
  telefonos: z.string().optional(),
  enfermedades: z.string().optional(),
  adultoResponsable: adultoResponsableSchema.partial().optional(),
});

const optionalPosIntQuery = z.preprocess(
  (v) => (v === '' || v === undefined || v === null ? undefined : v),
  z.string().regex(/^\d+$/).transform(Number).optional()
);

export const deportistasQuerySchema = z.object({
  page: optionalPosIntQuery,
  limit: optionalPosIntQuery,
  estado: z.enum(['EN_DEUDA', 'AL_DIA', 'MOROSA', 'INACTIVA']).optional(),
  disciplinaId: optionalPosIntQuery,
  search: z.preprocess((v) => (v === '' || v === undefined ? undefined : v), z.string().optional()),
});

export type CreateDeportistaInput = z.infer<typeof createDeportistaSchema>;
export type UpdateDeportistaInput = z.infer<typeof updateDeportistaSchema>;
export type DeportistasQuery = z.infer<typeof deportistasQuerySchema>;
