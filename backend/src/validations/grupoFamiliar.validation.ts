import { z } from 'zod';

const vinculoEnum = z.enum([
  'HIJO',
  'HIJA',
  'PADRE',
  'MADRE',
  'HERMANO',
  'HERMANA',
  'OTRO',
], {
  errorMap: () => ({ message: 'Vínculo inválido' }),
});

export const CrearGrupoFamiliarSchema = z.object({
  nombre: z.string().min(2, 'El nombre del grupo debe tener al menos 2 caracteres'),
  deportistaPrincipalId: z.coerce.number().int().positive('ID de deportista principal inválido'),
  miembros: z.array(
    z.object({
      socioId: z.coerce.number().int().positive('ID de socio inválido'),
      vinculo: vinculoEnum,
    })
  ).min(1, 'Debe haber al menos un miembro en el grupo'),
}).superRefine((data, ctx) => {
  // Validar que el deportista principal no esté en los miembros
  if (data.miembros.some((m) => m.socioId === data.deportistaPrincipalId)) {
    ctx.addIssue({
      code: 'custom',
      path: ['deportistaPrincipalId'],
      message: 'El deportista principal no puede estar en la lista de miembros',
    });
  }

  // Validar que no haya IDs duplicados en miembros
  const ids = data.miembros.map((m) => m.socioId);
  const idsUnicos = new Set(ids);
  if (ids.length !== idsUnicos.size) {
    ctx.addIssue({
      code: 'custom',
      path: ['miembros'],
      message: 'No puede haber miembros duplicados',
    });
  }
});

export const ActualizarGrupoFamiliarSchema = CrearGrupoFamiliarSchema.partial();

