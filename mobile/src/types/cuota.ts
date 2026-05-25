export type EstadoCuota = 'PENDIENTE' | 'VENCIDA' | 'PAGADA';

export interface CuotaPendiente {
  id: number;
  nroCuota: number;
  monto: number;
  fechaVencimiento: string;
  estadoCuota: EstadoCuota;
  disciplina?: string;
}

export interface CuotaPagada {
  id: number;
  nroCuota: number;
  monto: number;
  fechaPago?: string;
  medioPago?: string;
}

export interface EstadoCuentaResponse {
  deportista: {
    id: number;
    nombre: string;
    apellido: string;
  };
  cuotasPagadas: CuotaPagada[];
  cuotasPendientes: CuotaPendiente[];
  totalAdeudado: number;
}

export interface DebtStatusData {
  cuotasPendientes: CuotaPendiente[];
  totalAdeudado: number;
}
