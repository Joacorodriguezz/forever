import prisma from "../config/prisma";
import { Actividad, CreateActividadRequest, UpdateActividadRequest } from "../types/actividad";
import { Clase } from "../types/clase";

// Mapeo de Prisma a tipo Clase
function mapClasePrismaToClase(clase: any): Clase {
  return {
    id: clase.id,
    diaSemana: clase.diaSemana,
    horaInicio: clase.horaInicio,
    horaFin: clase.horaFin,
    activo: clase.activo,
    actividadId: clase.actividadId,
    profesorId: clase.profesorId ?? undefined,
    createdAt: clase.createdAt,
    profesor: clase.profesor
      ? {
          id: clase.profesor.id,
          nombre: clase.profesor.nombre,
          apellido: clase.profesor.apellido,
          email: clase.profesor.email,
          activo: clase.profesor.activo,
          createdAt: clase.profesor.createdAt,
        }
      : undefined,
  };
}

// Mapeo de Prisma a tipo Actividad
function mapActividadPrismaToActividad(actividad: any): Actividad {
  return {
    id: actividad.id,
    nombre: actividad.nombre,
    monto: actividad.monto,
    activo: actividad.activo,
    createdAt: actividad.createdAt,
    clases: actividad.clases?.map(mapClasePrismaToClase) ?? [],
  };
}

// Obtener todas las actividades
export async function getAllActividades(): Promise<Actividad[]> {
  const actividades = await prisma.actividad.findMany({
    orderBy: { createdAt: "desc" },
    include: { clases: { include: { profesor: true } } },
  });
  return actividades.map(mapActividadPrismaToActividad);
}

// Obtener actividad por ID
export async function getActividadById(id: number): Promise<Actividad> {
  const actividad = await prisma.actividad.findUnique({
    where: { id },
    include: { clases: { include: { profesor: true } } },
  });
  if (!actividad) throw new Error("Actividad no encontrada");
  return mapActividadPrismaToActividad(actividad);
}

// Crear actividad
export async function createActividad(data: CreateActividadRequest): Promise<Actividad> {
  const actividad = await prisma.actividad.create({ data });
  return mapActividadPrismaToActividad({ ...actividad, clases: [] });
}

// Actualizar actividad
export async function updateActividad(id: number, data: UpdateActividadRequest): Promise<Actividad> {
  const actividad = await prisma.actividad.update({
    where: { id },
    data,
    include: { clases: { include: { profesor: true } } },
  });
  return mapActividadPrismaToActividad(actividad);
}

// Eliminar actividad
// Elimina una Actividad y todo lo relacionado de forma atómica
export async function deleteActividad(id: number): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // 1) Traer IDs de eventos de esta actividad
    const eventos = await tx.evento.findMany({
      where: { actividadId: id },
      select: { id: true },
    });
    const eventoIds = eventos.map(e => e.id);

    // 2) Borrar entradas de esos eventos
    if (eventoIds.length > 0) {
      await tx.entrada.deleteMany({
        where: { eventoId: { in: eventoIds } },
      });
    }

    // 3) Borrar eventos de la actividad
    await tx.evento.deleteMany({
      where: { actividadId: id },
    });

    // 4) Borrar clases de la actividad
    await tx.clase.deleteMany({
      where: { actividadId: id },
    });

    // 5) Borrar relaciones many-to-many / auxiliares
    await tx.actividadSocio.deleteMany({
      where: { actividadId: id },
    });

    await tx.cuotaXactividad.deleteMany({
      where: { actividadId: id },
    });

    // 6) Borrar canchas de la actividad (después de eventos)
    await tx.cancha.deleteMany({
      where: { actividadId: id },
    });

    // 7) Finalmente, borrar la actividad
    await tx.actividad.delete({
      where: { id },
    });
  });
}


