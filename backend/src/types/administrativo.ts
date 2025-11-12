export interface Administrativo {
  id: number;
  usuarioId: number;
  nombre: string;
  apellido: string;
  dni: number;
  activo: boolean;
}

export interface CreateAdministrativoRequest {
    nombre: string;
    apellido: string;
    dni: number;
    usuarioId: number;
    activo: boolean;
}

export interface updateAdministrativoRequest { 
    nombre?: string;
    apellido?: string;
    dni?: number;
    usuarioId: number;
    activo?: boolean
}

export interface AdministrativoResponse {
  administrativo: Administrativo;
  message: string;
}

export interface AdministrativosListResponse {
  administrativos: Administrativo[];
  total: number;
  message: string;
}