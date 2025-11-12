import { DiaSemana } from "@prisma/client";
import { Profesor } from "./profesor";
import { Actividad } from "./actividad";

export interface Clase {
  id: number;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
  actividadId: number;
  profesorId?: number;
  actividad?: Actividad;
  profesor?: Profesor;
  createdAt?: Date;
}

export interface CreateClaseRequest {
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
  actividadId: number;
  profesorId?: number;
  activo?: boolean;
}

export interface UpdateClaseRequest {
  diaSemana?: DiaSemana;
  horaInicio?: string;
  horaFin?: string;
  profesorId?: number;
  activo?: boolean;
}

export interface ClaseResponse {
  clase: Clase;
  message: string;
}

export interface ClaseListResponse {
  clases: Clase[];
  total: number;
}
