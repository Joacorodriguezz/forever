import { z } from "zod";

const diasValidos = ["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"] as const;

export const createClaseSchema = z.object({
  diaSemana: z.enum(diasValidos, { message: "Día inválido" }),
  horaInicio: z.string().min(1, "Hora de inicio requerida"),
  horaFin: z.string().min(1, "Hora de fin requerida"),
  profesorId: z.preprocess(
    val => val === null ? undefined : Number(val),
    z.number().int().positive().optional()
  ),
  activo: z.boolean().optional(),
});

export const updateClaseSchema = createClaseSchema.partial();
