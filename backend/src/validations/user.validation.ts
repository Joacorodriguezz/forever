import { z } from 'zod';

const roleEnum = z.enum(['ADMIN', 'ADMINISTRATIVO', 'DEPORTISTA']);

const estadoDeportistaEnum = z.enum(['AL_DIA', 'EN_DEUDA', 'MOROSA', 'INACTIVA']);

const deportistaSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  apellido: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
  dni: z.coerce.number().int().positive().refine(val => val.toString().length === 8, {
    message: "El DNI debe tener exactamente 8 dígitos",
  }),
  fechaNacimiento: z.coerce.date().refine(
    (val) => !isNaN(val.getTime()),
    { message: "La fecha de nacimiento no es válida" }
  ),
  categoria: z.string().min(1, { message: "La categoría es obligatoria" }),
  obraSocial: z.string().min(1, { message: "La obra social es obligatoria" }),
  id_disciplina: z.number().int().positive({ message: "Debe seleccionar una disciplina" }),
  id_domicilio: z.number().int().positive().optional(),
  sexo: z.string().optional().nullable(),
  fotoCarnet: z.string().optional().nullable(),
  estado: estadoDeportistaEnum.optional(),
});

const deportistaUpdateSchema = deportistaSchema.partial().extend({
  estado: estadoDeportistaEnum.optional(),
});

const administrativoSchema = z.object({
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  apellido: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
  dni: z.coerce.number().int().positive().refine(val => val.toString().length === 8, {
    message: 'El DNI debe tener exactamente 8 dígitos',
  }),
});

const administrativoUpdateSchema = administrativoSchema.partial();

export const UpdateUserSchema = z.object({
  mail: z.string().email("Email inválido").trim().optional(),
  contrasena: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .optional(),
  deportista: deportistaUpdateSchema.optional(),
  administrativo: administrativoUpdateSchema.optional(),
});

export const RegisterSchema = z.object({
  mail: z.string().email('Ingrese un email válido').trim(),
  contrasena: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe tener mínimo 8 caracteres y al menos una mayúscula'),
  role: roleEnum,
  deportista: deportistaSchema.optional(),
  administrativo: administrativoSchema.optional(),
}).superRefine((data, ctx) => {
  // Validar nombre no vacío
  if (data.role === 'DEPORTISTA' && data.deportista) {
    if (!data.deportista.nombre || data.deportista.nombre.trim().length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['deportista', 'nombre'],
        message: 'Complete todos los campos obligatorios',
      });
    }
  }

  if (data.role === 'DEPORTISTA' && !data.deportista) {
    ctx.addIssue({
      code: 'custom',
      path: ['deportista'],
      message: 'Los datos de deportista son obligatorios',
    });
  }
  if (data.role === 'ADMINISTRATIVO' && !data.administrativo) {
    ctx.addIssue({
      code: 'custom',
      path: ['administrativo'],
      message: 'Los datos de administrativo son obligatorios',
    });
  }

  // Validar unicidad de DNI y email (se validará en el servicio)
});
