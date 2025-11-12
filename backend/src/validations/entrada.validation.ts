import { z } from "zod";

// Crear entrada
export const createEntradaSchema = z.object({
  eventoId: z.preprocess((val) => Number(val), z.number().int().positive("ID de evento inválido")),
  cantidad: z.preprocess((val) => Number(val), z.number().int().positive("Cantidad debe ser mayor a 0")),
  socioId: z.preprocess((val) => val ? Number(val) : undefined, z.number().optional()),
  formaDePago: z.enum(["EFECTIVO", "CBU"]),
  comprobanteUrl: z.string().url().optional(),
});

// Actualizar entrada (todos opcionales)
export const updateEntradaSchema = z.object({
  cantidad: z.preprocess((val) => Number(val), z.number().int().positive("Cantidad debe ser mayor a 0")).optional(),
  formaDePago: z.enum(["EFECTIVO", "CBU"]).optional(),
  comprobanteUrl: z.string().url().optional(),
});
