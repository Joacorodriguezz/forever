export interface Deportista {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  fechaNacimiento: Date;
  estado: 'AL_DIA' | 'EN_DEUDA' | 'MOROSA' | 'INACTIVA';
  categoria: string;
  obraSocial: string;
  id_cuenta: number;
  id_disciplina: number;
  id_domicilio?: number | null;
  sexo?: string | null;
  fotoCarnet?: string | null;
}

export interface ActualizarDeportistaRequest {
  nombre?: string;
  apellido?: string;
  dni?: number;
  fechaNacimiento?: string;
  estado?: 'AL_DIA' | 'EN_DEUDA' | 'MOROSA' | 'INACTIVA';
  categoria?: string;
  obraSocial?: string;
  id_disciplina?: number;
  id_domicilio?: number;
  sexo?: string;
  fotoCarnet?: string;
}

export interface GetDeportistaResponse extends Deportista { }
