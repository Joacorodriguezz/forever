import { z } from 'zod';

const roleEnum = z.enum(['ADMIN', 'ADMINISTRATIVO', 'SOCIO']);

const socioSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  apellido: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
  dni: z.coerce.number().int().positive().refine(val => val.toString().length === 8, {
    message: "El DNI debe tener exactamente 8 dígitos",
  }),
  fechaNacimiento: z.coerce.date().refine(
    (val) => !isNaN(val.getTime()),
    { message: "La fecha de nacimiento no es válida" }
  ),
  pais: z.enum(["ARGENTINA", "BOLIVIA", "BRASIL", "CHILE", "COLOMBIA", "COSTA_RICA", "CUBA", "ECUADOR", "EL_SALVADOR", "GUATEMALA", "HONDURAS", "MEXICO", "NICARAGUA", "PANAMA", "PARAGUAY", "PERU", "REPUBLICA_DOMINICANA", "URUGUAY", "VENEZUELA"]),
  sexo: z.enum(["MASCULINO", "FEMENINO", "OTRO"]),
  fotoCarnet: z.string().optional().nullable(),
  estado: z.enum(["ACTIVO", "INACTIVO"]).optional(), // 👈 nuevo
});

const socioUpdateSchema = socioSchema.partial().extend({
  estado: z.enum(["ACTIVO", "INACTIVO"]).optional(),
});

const administrativoSchema = z.object({
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  apellido: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
  dni: z.coerce.number().int().positive().refine(val => val.toString().length === 8, {
    message: 'El DNI debe tener exactamente 8 dígitos',
  }),
  activo: z.boolean().optional(),
});

const administrativoUpdateSchema = administrativoSchema.partial();

export const UpdateUserSchema = z.object({
  email: z.email("Email inválido").trim().optional(),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .optional(),
  role: roleEnum.optional(),
  socio: socioUpdateSchema.optional(),
  administrativo: administrativoUpdateSchema.optional(),
}).superRefine((data, ctx) => {
  if (data.role === "SOCIO" && !data.socio) {
    ctx.addIssue({
      code: "custom",
      path: ["socio"],
      message: "Los datos de socio son obligatorios cuando el rol es SOCIO",
    });
  }
  if (data.role === "ADMINISTRATIVO" && !data.administrativo) {
    ctx.addIssue({
      code: "custom",
      path: ["administrativo"],
      message: "Los datos de administrativo son obligatorios cuando el rol es ADMINISTRATIVO",
    });
  }
});

export const RegisterSchema = z.object({
  email: z.string().email('Ingrese un email válido').trim(),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe tener mínimo 8 caracteres y al menos una mayúscula'),
  role: roleEnum,
  socio: socioSchema.optional(),
  administrativo: administrativoSchema.optional(),
}).superRefine((data, ctx) => {
  // Validar nombre no vacío
  if (data.role === 'SOCIO' && data.socio) {
    if (!data.socio.nombre || data.socio.nombre.trim().length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['socio', 'nombre'],
        message: 'Complete todos los campos obligatorios',
      });
    }
  }
  
  if (data.role === 'SOCIO' && !data.socio) {
    ctx.addIssue({
      code: 'custom',
      path: ['socio'],
      message: 'Los datos de socio son obligatorios',
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

