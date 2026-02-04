import { z } from 'zod';

const integranteSchema = z.object({
  deportistaId: z
    .number({ message: 'El deportista es requerido' })
    .int()
    .positive('ID de deportista invalido'),
  vinculo: z.enum(['PADRE', 'MADRE', 'HIJO', 'HERMANO', 'OTRO'], { message: 'Vinculo invalido' }),
  esPrincipal: z.boolean().default(false),
});

// CU13 - Gestionar Grupo Familiar
export const createGrupoFamiliarSchema = z
  .object({
    nombre: z.string({ message: 'El nombre es requerido' }).min(1, 'El nombre es requerido'),
    integrantes: z
      .array(integranteSchema)
      .min(2, 'El grupo familiar debe tener al menos 2 integrantes'),
  })
  .refine((data) => data.integrantes.filter((i) => i.esPrincipal).length === 1, {
    message: 'Debe haber exactamente un integrante principal',
  });

export const updateGrupoFamiliarSchema = z.object({
  nombre: z.string().min(1).optional(),
  integrantes: z.array(integranteSchema).min(2).optional(),
});

export type CreateGrupoFamiliarInput = z.infer<typeof createGrupoFamiliarSchema>;
export type UpdateGrupoFamiliarInput = z.infer<typeof updateGrupoFamiliarSchema>;
