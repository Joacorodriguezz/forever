import type { ApiResponse } from './auth';

export type EstadoPago = 'APROBADO' | 'RECHAZADO' | 'PENDIENTE';

export interface PagoCuota {
  id: number;
  nroCuota: number;
  anio?: number;
  monto: number | string;
  disciplina?: { nombre: string };
}

export interface Pago {
  id: number;
  fechaPago: string;
  monto: number | string;
  estadoPago: EstadoPago;
  medioPago?: string | null;
  linkComprobante?: string | null;
  mercadoPagoId?: string | null;
  cuotaId: number;
  deportistaId: number;
  cuota?: PagoCuota;
}

export interface CrearPagoResponse {
  pago: Pago;
  checkoutUrl: string;
  publicKey: string;
  preferenceId: string;
}

export interface HistorialPagoItem {
  id: number;
  fecha: string;
  monto: number;
  medioPago?: string | null;
  estado: string;
  linkComprobante?: string | null;
  mercadoPagoId?: string | null;
  cuota: {
    nroCuota: number;
    anio?: number;
    disciplina: string;
  };
}

export type CrearPagoApiResponse = ApiResponse<CrearPagoResponse>;
export type PagoApiResponse = ApiResponse<Pago>;
export type HistorialApiResponse = ApiResponse<{ pagos: HistorialPagoItem[] }>;
