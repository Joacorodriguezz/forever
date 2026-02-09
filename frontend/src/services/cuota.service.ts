import api from '../config/api';
import type { ApiResponse } from './types';

export const cuotaService = {
  getMiEstado: async (): Promise<ApiResponse<{ cuotasPendientes: Array<{ id: number; nroCuota: number; monto: number; fechaVencimiento: string; estadoCuota: string }>; totalAdeudado: number }>> => {
    const response = await api.get('/cuotas/mi-estado');
    return response.data;
  },

  getByDeportista: async (deportistaId: number, query?: { page?: number; limit?: number }): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    const response = await api.get(`/cuotas/deportista/${deportistaId}?${params}`);
    return response.data;
  },
};
