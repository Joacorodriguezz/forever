// GET /api/socios/:id
export interface GetSocioResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;        // 'dd/mm/aaaa'
  pais: string;
  sexo: 'masculino' | 'femenino' | 'otro';
  cuotaAlDia: boolean;
}

// GET /api/socios/:id/estado-cuota
export interface GetEstadoCuota {
  cuotaAlDia: boolean;
  fechaVencimiento: string;      // 'dd/mm/aaaa' si está vencida
  montoAdeudado: number;         // ARS
  message: string;               // 'Cuota al día', 'Cuota vencida', etc.
}

// GET /api/socios/:id/accesos
export interface Acceso {
  nombre: string;                  // 'Reservar Cancha', 'Mis entradas', etc.
  habilitado: boolean;
  motivo?: string;                 // 'Cuota vencida'
}
export interface GetAccesosResponse {
  accesos: Acceso[];
}
