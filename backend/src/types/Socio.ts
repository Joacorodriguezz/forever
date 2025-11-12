import { Sexo, Usuario } from '@prisma/client';

export interface Socio {  
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  email: string;
  fechaNacimiento: Date; 
  pais: string;
  sexo: Sexo;
  fotoCarnet?: string | null;
  usuarioId: number; 
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface ActualizarSocioRequest { 
  nombre?: string;
  apellido?: string;
  dni?: number;
  email?: string;
  fechaNacimiento?: string; 
  pais?: string;
  sexo?: Sexo;
  fotoCarnet?: string; 
  usuarioId: number;
  estado?: 'ACTIVO' | 'INACTIVO';
}

export interface GetSocioResponse extends Socio {} 