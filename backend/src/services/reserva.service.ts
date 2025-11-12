// src/services/reserva.service.ts
import prisma from "../config/prisma";
import { 
  Reserva, 
  CrearReservaDTO, 
  ActualizarReservaDTO, 
  TurnoDisponible, 
  FiltroReservas
} from "../types/reserva.types";

// Función para obtener deportes activos desde la base de datos
export async function obtenerDeportesDisponibles(): Promise<string[]> {
  const actividades = await prisma.actividad.findMany({
    where: { activo: true },
    select: { nombre: true },
    orderBy: { nombre: 'asc' }
  });
  
  return actividades.map((actividad: { nombre: string }) => actividad.nombre);
}

// Función para obtener canchas disponibles para un deporte específico
export async function obtenerCanchasPorDeporte(deporte: string): Promise<Array<{id: number, nombre: string, descripcion?: string}>> {
  // Buscar la actividad por nombre
  const actividad = await prisma.actividad.findFirst({
    where: { 
      nombre: deporte,
      activo: true 
    },
    select: { id: true }
  });

  if (!actividad) {
    return [];
  }

  // Obtener canchas activas de esa actividad
  const canchas = await prisma.cancha.findMany({
    where: { 
      actividadId: actividad.id,
      activa: true 
    },
    select: { 
      id: true, 
      nombre: true, 
      descripcion: true 
    },
    orderBy: { nombre: 'asc' }
  });

  return canchas.map((cancha: { id: number; nombre: string; descripcion: string | null}) => ({
    ...cancha,
    descripcion: cancha.descripcion || undefined
  }));
}

// Función helper para obtener cancha por defecto según el deporte
function obtenerCanchaPorDeporte(deporte: string): string {
  // Mapeo básico, se puede expandir según necesidades
  const mapeoBasico: Record<string, string> = {
    'Futsal': 'Cancha 1',
    'Volley': 'Cancha 2', 
    'Tenis': 'Cancha 3',
    'Pelota Paleta': 'Cancha 4'
  };
  
  return mapeoBasico[deporte] || `Cancha ${deporte}`;
}

// Obtener turnos disponibles para un deporte y fecha específica
export async function obtenerTurnosDisponibles(
  deporte: string, 
  fecha: string,
  socioId?: number,
  cancha?: string
): Promise<TurnoDisponible[]> {
  const turnos = [];
  const fechaObj = new Date(fecha);
  
  // Usar cancha por defecto si no se proporciona
  const canchaFinal = cancha || obtenerCanchaPorDeporte(deporte);
  
  // Generar turnos de 10:00 a 22:00
  for (let h = 10; h <= 22; h++) {
    const hora = `${h.toString().padStart(2, '0')}:00`;
    
    // Buscar reserva existente para este turno
    const reservaExistente = await prisma.reserva.findFirst({
      where: {
    cancha: canchaFinal,
    deporte,
    fecha: fechaObj,
    hora,
    estado: 'ACTIVA'
      },
      include: {
        socio: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true
          }
        }
      }
    });

    turnos.push({
      hora,
      disponible: !reservaExistente,
      reserva: reservaExistente || undefined,
      esMiReserva: socioId ? reservaExistente?.socioId === socioId : false
    });
  }
  
  return turnos;
}

// Obtener todas las reservas con filtros opcionales
export async function obtenerReservas(filtros: FiltroReservas = {}): Promise<Reserva[]> {
  const where: any = {};
  
  if (filtros.cancha) where.cancha = filtros.cancha;
  if (filtros.deporte) where.deporte = filtros.deporte;
  if (filtros.fecha) where.fecha = new Date(filtros.fecha);
  if (filtros.socioId) where.socioId = filtros.socioId;
  if (filtros.estado) where.estado = filtros.estado;

  return await prisma.reserva.findMany({
    where,
    include: {
      socio: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true
        }
      }
    },
    orderBy: [
      { fecha: 'asc' },
      { hora: 'asc' }
    ]
  });
}

// Obtener solo reservas activas y futuras de un socio
export async function obtenerReservasActivasFuturas(socioId: number): Promise<Reserva[]> {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Inicio del día actual

  return await prisma.reserva.findMany({
    where: {
  socioId: socioId,
  estado: 'ACTIVA',
      fecha: {
        gte: hoy // Mayor o igual a hoy
      }
    },
    include: {
      socio: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true
        }
      }
    },
    orderBy: [
      { fecha: 'asc' },
      { hora: 'asc' }
    ]
  });
}

// Crear una nueva reserva
export async function registrarReserva(data: CrearReservaDTO): Promise<Reserva> {
  // Usar cancha por defecto si no se proporciona
  const canchaFinal = data.cancha || obtenerCanchaPorDeporte(data.deporte);
  
  // Verificar que no exista otra reserva activa para el mismo turno
  const reservaExistente = await prisma.reserva.findFirst({
    where: {
      cancha: canchaFinal,
      deporte: data.deporte,
      fecha: new Date(data.fecha),
      hora: data.hora,
      estado: 'ACTIVA'
    }
  });

  if (reservaExistente) {
    throw new Error('El turno ya está reservado');
  }

  // Verificar que el socio existe
  const socio = await prisma.socio.findUnique({
    where: { id: data.socioId }
  });

  if (!socio) {
    throw new Error('Socio no encontrado');
  }

  return await prisma.reserva.create({
    data: {
      cancha: canchaFinal,
      deporte: data.deporte,
      fecha: new Date(data.fecha),
      hora: data.hora,
      socioId: data.socioId,
  estado: 'ACTIVA'
    },
    include: {
      socio: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true
        }
      }
    }
  });
}

// Actualizar una reserva (principalmente para cambiar estado)
export async function actualizarReserva(id: number, data: ActualizarReservaDTO): Promise<Reserva> {
  return await prisma.reserva.update({
    where: { id },
    data,
    include: {
      socio: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true
        }
      }
    }
  });
}

// Cancelar una reserva (cambiar estado a CANCELADA)
export async function cancelarReserva(id: number): Promise<Reserva> {
  return await prisma.reserva.update({
    where: { id },
  data: { estado: 'CANCELADA' },
    include: {
      socio: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true
        }
      }
    }
  });
}

// Obtener una reserva por ID
export async function obtenerReservaPorId(id: number): Promise<Reserva | null> {
  return await prisma.reserva.findUnique({
    where: { id },
    include: {
      socio: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true
        }
      }
    }
  });
}

