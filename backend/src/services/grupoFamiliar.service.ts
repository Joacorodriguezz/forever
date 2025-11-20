import prisma from '../config/prisma';

// CU13 - Gestionar Grupo Familiar
export interface GrupoFamiliar {
  id: number;
  nombre: string;
  deportistaPrincipalId: number;
  miembros: Array<{
    id: number;
    nombre: string;
    apellido: string;
    dni: number;
    vinculo: string;
  }>;
  creadoEn: Date;
}

export interface CrearGrupoFamiliarRequest {
  nombre: string;
  deportistaPrincipalId: number;
  miembros: Array<{
    socioId: number;
    vinculo: string; // 'HIJO', 'HIJA', 'PADRE', 'MADRE', 'HERMANO', 'HERMANA', 'OTRO'
  }>;
}

export interface ActualizarGrupoFamiliarRequest {
  nombre?: string;
  deportistaPrincipalId?: number;
  miembros?: Array<{
    socioId: number;
    vinculo: string;
  }>;
}

// Nota: Como no existe el modelo en Prisma, usaremos una tabla temporal o un campo en Socio
// Por ahora, implementaremos la lógica usando una relación many-to-many entre Socios
// Para una implementación completa, se necesitaría agregar el modelo GrupoFamiliar al schema

// Implementación temporal usando un campo JSON o una tabla de relación
// Esta es una implementación básica que puede mejorarse con un modelo dedicado

export async function crearGrupoFamiliar(
  data: CrearGrupoFamiliarRequest
): Promise<GrupoFamiliar> {
  // Validar que el deportista principal existe
  const principal = await prisma.socio.findUnique({
    where: { id: data.deportistaPrincipalId },
  });

  if (!principal) {
    throw new Error('Deportista principal no encontrado');
  }

  // Validar que todos los miembros existen
  const miembrosIds = data.miembros.map((m) => m.socioId);
  const miembros = await prisma.socio.findMany({
    where: { id: { in: miembrosIds } },
  });

  if (miembros.length !== data.miembros.length) {
    throw new Error('Uno o más miembros no fueron encontrados');
  }

  // Validar que el deportista principal no esté ya en otro grupo
  // (esto requeriría un campo grupoFamiliarId en Socio o una tabla de relación)

  // Por ahora, retornamos una estructura básica
  // En una implementación completa, se crearía el registro en la tabla GrupoFamiliar
  return {
    id: 1, // Temporal - se generaría con autoincrement
    nombre: data.nombre,
    deportistaPrincipalId: data.deportistaPrincipalId,
    miembros: miembros.map((s, index) => ({
      id: s.id,
      nombre: s.nombre,
      apellido: s.apellido,
      dni: s.dni,
      vinculo: data.miembros[index].vinculo,
    })),
    creadoEn: new Date(),
  };
}

export async function getGruposFamiliares(): Promise<GrupoFamiliar[]> {
  // Implementación temporal
  // En una implementación completa, se consultaría la tabla GrupoFamiliar
  return [];
}

export async function getGrupoFamiliarById(id: number): Promise<GrupoFamiliar | null> {
  // Implementación temporal
  return null;
}

export async function actualizarGrupoFamiliar(
  id: number,
  data: ActualizarGrupoFamiliarRequest
): Promise<GrupoFamiliar> {
  // Implementación temporal
  throw new Error('Funcionalidad en desarrollo');
}

export async function eliminarGrupoFamiliar(id: number): Promise<void> {
  // Implementación temporal
  throw new Error('Funcionalidad en desarrollo');
}

