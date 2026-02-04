export interface Localidad {
    id_localidad: number;
    codigoPostal: number;
    nombre: string;
}

export interface CreateLocalidadRequest {
    codigoPostal: number;
    nombre: string;
}

export interface UpdateLocalidadRequest {
    codigoPostal?: number;
    nombre?: string;
}
