export interface Profesor {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  activo: boolean;
  createdAt?: Date;
}

export interface CreateProfesorRequest {
  nombre: string;
  apellido: string;
  email: string;
  activo?: boolean;
}

export interface UpdateProfesorRequest {
  nombre?: string;
  apellido?: string;
  email?: string;
  activo?: boolean;
}

export interface ProfesorResponse {
  profesor: Profesor;
  message: string;
}

export interface ProfesorListResponse {
  profesores: Profesor[];
  total: number;
}
