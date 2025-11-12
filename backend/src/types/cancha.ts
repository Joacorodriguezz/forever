import { Actividad } from "./actividad";
import { Evento } from "./evento";

export interface Cancha {
  id: number;
  nombre: string;
  descripcion?: string | null;
  activa: boolean;
  actividadId: number;
  actividad?: Actividad;  
  eventos?: Evento[];    
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CrearCanchaDTO {
  nombre: string;
  descripcion?: string | null;
  actividadId: number;
  activa?: boolean;
}

export interface ActualizarCanchaDTO {
  nombre?: string;
  descripcion?: string | null;
  activa?: boolean;
}
