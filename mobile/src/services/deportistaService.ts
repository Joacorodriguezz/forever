import api from '../config/api';
import type { ApiResponse, DeportistaProfile } from '../types/auth';
import type { HistorialApiResponse } from '../types/pago';

export const deportistaService = {
  getMiPerfil: async (): Promise<ApiResponse<DeportistaProfile>> => {
    const response = await api.get<ApiResponse<DeportistaProfile>>('/deportistas/mi-perfil');
    return response.data;
  },

  getMiHistorial: async (): Promise<HistorialApiResponse> => {
    const response = await api.get<HistorialApiResponse>('/deportistas/mi-historial');
    return response.data;
  },
};
