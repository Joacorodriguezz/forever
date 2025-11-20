import { z } from 'zod';

// Validación de email con regex estándar
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginSchema = z.object({
  emailOdni: z.string().min(1, 'Debe ingresar un email o DNI'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
}).superRefine((data, ctx) => {
  // Si no es numérico (DNI), validar formato de email
  if (!/^\d+$/.test(data.emailOdni)) {
    if (!emailRegex.test(data.emailOdni)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['emailOdni'],
        message: 'Formato de email incorrecto',
      });
    }
  }
});