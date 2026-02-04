export interface Domicilio {
    id_domicilio: number;
    id_localidad: number;
}

export interface CreateDomicilioRequest {
    id_localidad: number;
}

export interface UpdateDomicilioRequest {
    id_localidad?: number;
}
