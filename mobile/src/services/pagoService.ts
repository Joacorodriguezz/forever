import api from '../config/api';
import type { CrearPagoApiResponse, PagoApiResponse } from '../types/pago';

export const pagoService = {
  crear: async (cuotaId: number): Promise<CrearPagoApiResponse> => {
    const response = await api.post<CrearPagoApiResponse>('/pagos/crear', {
      cuotaId,
      medioPago: 'Mercado Pago',
    });
    return response.data;
  },

  getById: async (pagoId: number): Promise<PagoApiResponse> => {
    const response = await api.get<PagoApiResponse>(`/pagos/${pagoId}`);
    return response.data;
  },

  sincronizar: async (pagoId: number, mercadoPagoId: string): Promise<PagoApiResponse> => {
    const response = await api.post<PagoApiResponse>(`/pagos/${pagoId}/sincronizar`, {
      mercadoPagoId,
    });
    return response.data;
  },
};
