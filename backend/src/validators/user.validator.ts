import { z } from 'zod';

// CU03 - Asignar Rol
export const assignRoleSchema = z.object({
  rol: z.enum(['ADMIN', 'ADMINISTRATIVO', 'DEPORTISTA'], { message: 'Rol invalido' }),
});

// CU17 - Modificar Perfil
export const updateProfileSchema = z.object({
  email: z.string().email('Formato de email incorrecto').optional(),
  telefono: z.string().optional(),
  currentPassword: z.string().optional(),
  password: z
    .string()
    .min(6, 'La contrasena debe tener al menos 6 caracteres')
    .optional(),
}).refine((data) => {
  if (data.password && !data.currentPassword) return false;
  return true;
}, { message: 'La contrasena actual es requerida para cambiar la contrasena', path: ['currentPassword'] });

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID invalido').transform(Number),
});

export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
