import api from '../config/api';
import type { ApiResponse } from '../types/auth';

export interface GrupoFamiliarIntegrante {
  deportista?: {
    id?: number;
    nombre?: string;
    apellido?: string;
    dni?: string;
    disciplina?: { nombre?: string } | string;
    categoria?: { nombre?: string } | string;
  };
  deportistaId?: number;
  vinculo?: string;
  esPrincipal?: boolean;
}

export interface GrupoFamiliarMio {
  id: number;
  nombre?: string;
  titularDni?: string;
  integrantes?: GrupoFamiliarIntegrante[];
}

export const grupoFamiliarService = {
  getMios: async (): Promise<ApiResponse<GrupoFamiliarMio[]>> => {
    const response = await api.get<ApiResponse<GrupoFamiliarMio[]>>('/grupos-familiares/mios');
    return response.data;
  },
};
