import { z } from 'zod';

export const LoginSchema = z.object({
  emailOdni: z.string().min(3, 'Debe ingresar un email o DNI'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});