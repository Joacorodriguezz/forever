import api from '../config/api';

export interface CrearPagoResponse {
  pago: {
    id: number;
    estadoPago: string;
    monto: number;
  };
  checkoutUrl: string;
  publicKey: string;
  preferenceId: string;
}

export const pagoService = {
  crear: async (cuotaId: number) => {
    const response = await api.post<{ success: boolean; data: CrearPagoResponse }>('/pagos/crear', {
      cuotaId,
      medioPago: 'Mercado Pago',
    });
    return response.data;
  },
};
