export interface Enfermedad {
    id_enfermedad: number;
    nombre: string;
}

export interface CreateEnfermedadRequest {
    nombre: string;
}

export interface UpdateEnfermedadRequest {
    nombre?: string;
}
