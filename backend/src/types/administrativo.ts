export interface Administrativo {
  id_administrativo: number;
  id_cuenta: number;
  nombre: string;
  apellido: string;
  dni: number;
}

export interface CreateAdministrativoRequest {
  nombre: string;
  apellido: string;
  dni: number;
  id_cuenta: number;
}

export interface UpdateAdministrativoRequest {
  nombre?: string;
  apellido?: string;
  dni?: number;
  id_cuenta: number;
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