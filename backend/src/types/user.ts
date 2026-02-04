import { Deportista } from './Deportista';
import { Administrativo } from './administrativo';

export type Role = 'ADMIN' | 'ADMINISTRATIVO' | 'DEPORTISTA';

export interface UserData {
  id_cuenta: number;
  mail: string;
  deportista?: Deportista | null;
  administrativo?: Administrativo | null;
}

export interface CreateUserRequest {
  mail: string;
  contrasena: string;
  deportista?: {
    nombre: string;
    apellido: string;
    dni: number;
    fechaNacimiento: Date;
    estado: 'AL_DIA' | 'EN_DEUDA' | 'MOROSA' | 'INACTIVA';
    categoria: string;
    obraSocial: string;
    id_disciplina: number;
    id_domicilio?: number;
    sexo?: string;
    fotoCarnet?: string;
  };
  administrativo?: {
    nombre: string;
    apellido: string;
    dni: number;
  };
}

export interface UpdateUserRequest {
  mail?: string;
  contrasena?: string;
  deportista?: {
    nombre?: string;
    apellido?: string;
    dni?: number;
    fechaNacimiento?: Date;
    estado?: 'AL_DIA' | 'EN_DEUDA' | 'MOROSA' | 'INACTIVA';
    categoria?: string;
    obraSocial?: string;
    id_disciplina?: number;
    id_domicilio?: number;
    sexo?: string;
    fotoCarnet?: string;
  };
  administrativo?: {
    nombre?: string;
    apellido?: string;
    dni?: number;
  };
}

export interface UserResponse {
  user: UserData;
  message: string;
}

export interface UsersListResponse {
  users: UserData[];
  total: number;
  message: string;
}
