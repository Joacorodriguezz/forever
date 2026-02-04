import { z } from 'zod';

const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const UpdateProfileSchema = z.object({
  mail: z.string().email('Ingrese un email válido').trim().optional(),
  contrasena: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .optional(),
}).refine((data) => {
  // Al menos un campo debe estar presente
  return data.mail !== undefined || data.contrasena !== undefined;
}, {
  message: 'Debe proporcionar al menos un campo para actualizar',
});

export const AssignRoleSchema = z.object({
  role: z.enum(['ADMIN', 'ADMINISTRATIVO', 'DEPORTISTA'], {
    errorMap: () => ({ message: 'Rol inválido. Debe ser ADMIN, ADMINISTRATIVO o DEPORTISTA' }),
  }),
});
