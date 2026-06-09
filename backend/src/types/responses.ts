export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    rol: string;
    nombre?: string;
    apellido?: string;
  };
}

export interface EstadoCuentaResponse {
  deportista: {
    id: number;
    nombre: string;
    apellido: string;
  };
  cuotasPagadas: {
    id: number;
    nroCuota: number;
    anio: number;
    monto: number;
    fechaPago: Date;
    medioPago: string | null;
    disciplina: string;
  }[];
  cuotasPendientes: {
    id: number;
    nroCuota: number;
    anio: number;
    monto: number;
    fechaVencimiento: Date;
    estadoCuota: string;
    disciplina: string;
  }[];
  totalAdeudado: number;
}

export interface HistorialPagosResponse {
  pagos: {
    id: number;
    fecha: Date;
    monto: number;
    medioPago: string | null;
    estado: string;
    linkComprobante: string | null;
    mercadoPagoId: string | null;
    cuota: {
      nroCuota: number;
      anio: number;
      disciplina: string;
    };
  }[];
}

export interface DeportistaConPagosPendientesResponse {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  cantidadCuotasPendientes: number;
  montoTotalAdeudado: number;
  vencimientoProximo: Date | null;
}
