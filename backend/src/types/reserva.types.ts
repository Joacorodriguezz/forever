import { $Enums } from '@prisma/client';

export type EstadoReserva = $Enums.EstadoReserva;

export interface Reserva {
  id: number;
  cancha: string;
  deporte: string;
  fecha: Date;
  hora: string;
  estado: EstadoReserva;
  socioId: number;
  createdAt: Date;
  updatedAt: Date;
  socio?: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  };
}

// DTOs para las operaciones
export interface CrearReservaDTO {
  cancha?: string; // opcional, se asigna por defecto según el deporte
  deporte: string;
  fecha: string; // formato YYYY-MM-DD
  hora: string; // formato HH:MM
  socioId: number;
}

export interface ActualizarReservaDTO {
  estado?: EstadoReserva;
}

export interface TurnoDisponible {
  hora: string;
  disponible: boolean;
  reserva?: Reserva;
  esMiReserva?: boolean;
}

export interface FiltroReservas {
  cancha?: string;
  deporte?: string;
  fecha?: string;
  socioId?: number;
  estado?: EstadoReserva;
}

