import api from '../config/api';
import type { ApiResponse, DeportistaProfile } from '../types/auth';
import type { HistorialPagosResponse } from '../types/pago';

export const deportistaService = {
  getMiPerfil: async (): Promise<ApiResponse<DeportistaProfile>> => {
    const response = await api.get<ApiResponse<DeportistaProfile>>('/deportistas/mi-perfil');
    return response.data;
  },

  getMiHistorial: async (): Promise<ApiResponse<HistorialPagosResponse>> => {
    const response = await api.get<ApiResponse<HistorialPagosResponse>>('/deportistas/mi-historial');
    return response.data;
  },
};
