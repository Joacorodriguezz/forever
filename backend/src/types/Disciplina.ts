export interface Disciplina {
    id_disciplina: number;
    nombre: string;
    precioMensual: number;
}

export interface CreateDisciplinaRequest {
    nombre: string;
    precioMensual: number;
}

export interface UpdateDisciplinaRequest {
    nombre?: string;
    precioMensual?: number;
}
