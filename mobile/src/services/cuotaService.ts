import api from '../config/api';
import type { ApiResponse } from '../types/auth';
import type { EstadoCuentaResponse } from '../types/cuota';

export const cuotaService = {
  getMiEstado: async (): Promise<ApiResponse<EstadoCuentaResponse>> => {
    const response = await api.get<ApiResponse<EstadoCuentaResponse>>('/cuotas/mi-estado');
    return response.data;
  },
};
