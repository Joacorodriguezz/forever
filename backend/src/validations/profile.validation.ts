import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const UpdateProfileSchema = z.object({
  email: z.string().email('Ingrese un email válido').trim().optional(),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .optional(),
  telefono: z.string().optional().nullable(),
}).refine((data) => {
  // Al menos un campo debe estar presente
  return data.email !== undefined || data.password !== undefined || data.telefono !== undefined;
}, {
  message: 'Debe proporcionar al menos un campo para actualizar',
});

export const AssignRoleSchema = z.object({
  role: z.enum(['ADMIN', 'ADMINISTRATIVO', 'SOCIO'], {
    errorMap: () => ({ message: 'Rol inválido. Debe ser ADMIN, ADMINISTRATIVO o SOCIO' }),
  }),
});

