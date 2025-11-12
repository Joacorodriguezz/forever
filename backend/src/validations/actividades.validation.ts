import { z } from "zod";

export const createActividadSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  monto: z.preprocess((val) => Number(val), 
    z.number().min(0, "El monto debe ser mayor o igual a 0")
  ),
  activo: z.boolean().optional(),
});

export const updateActividadSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").optional(),
  monto: z.preprocess((val) => val !== undefined ? Number(val) : undefined,
    z.number().min(0, "El monto debe ser mayor o igual a 0").optional()
  ),
  activo: z.boolean().optional(),
});
