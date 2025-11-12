import { z } from "zod";

export const createProfesorSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  apellido: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
  email: z.email({ message: "Debe ser un email válido" }),
  activo: z.boolean().optional(),
});

export const updateProfesorSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }).optional(),
  apellido: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }).optional(),
  email: z.email({ message: "Debe ser un email válido" }).optional(),
  activo: z.boolean().optional(),
});
