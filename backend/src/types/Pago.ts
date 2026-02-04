export interface Pago {
    id_pago: number;
    fechaPago: Date;
    estadoPago: string;
    linkComprobante?: string | null;
    id_cuota: number;
    id_deportista: number;
}

export interface CreatePagoRequest {
    fechaPago: Date;
    estadoPago: string;
    linkComprobante?: string;
    id_cuota: number;
    id_deportista: number;
}

export interface UpdatePagoRequest {
    fechaPago?: Date;
    estadoPago?: string;
    linkComprobante?: string;
}
