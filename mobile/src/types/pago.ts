export type EstadoOperacion = 'APROBADA' | 'RECHAZADA';

export interface PagoHistorialItem {
  id: number;
  fecha: string;
  monto: number;
  medioPago?: string | null;
  estado: string;
  cuota?: {
    nroCuota: number;
    anio?: number;
    disciplina?: string | { nombre?: string };
  };
}

export interface HistorialPagosResponse {
  pagos: PagoHistorialItem[];
}

export interface Operacion {
  id: number;
  fecha: string;
  mesCuota: number;
  anioCuota: number;
  monto: number;
  estado: EstadoOperacion;
  disciplina?: string;
}
