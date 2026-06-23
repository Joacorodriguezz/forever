import api from '../config/api';
import type { ApiResponse } from '../types/auth';

export interface GrupoFamiliarMio {
  id: number;
  nombre?: string;
  titularDni?: string;
  integrantes?: Array<{
    esPrincipal?: boolean;
    deportista?: {
      id?: number;
      nombre?: string;
      apellido?: string;
      dni?: string;
      disciplina?: { nombre?: string };
      categoria?: { nombre?: string };
    };
  }>;
}

export const grupoFamiliarService = {
  getMios: async (): Promise<ApiResponse<GrupoFamiliarMio[]>> => {
    const response = await api.get<ApiResponse<GrupoFamiliarMio[]>>('/grupos-familiares/mios');
    return response.data;
  },
};
