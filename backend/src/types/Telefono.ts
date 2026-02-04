export interface Telefono {
    id_telefono: string; // UUID
    numero: number;
    id_deportista: number;
}

export interface CreateTelefonoRequest {
    numero: number;
    id_deportista: number;
}

export interface UpdateTelefonoRequest {
    numero?: number;
}
