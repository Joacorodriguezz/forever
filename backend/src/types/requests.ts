import { Rol, Vinculo, Periodicidad } from '@prisma/client';

// =============================================================================
// AUTH DTOs
// =============================================================================

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  password: string;
  telefono?: string;
  rol: Rol;
}

// =============================================================================
// USER DTOs
// =============================================================================

export interface UpdateProfileDTO {
  email?: string;
  telefono?: string;
  password?: string;
}

export interface AssignRoleDTO {
  rol: Rol;
}

// =============================================================================
// DEPORTISTA DTOs
// =============================================================================

export interface CreateDomicilioDTO {
  calle: string;
  numero: string;
  piso?: string;
  departamento?: string;
  localidadId: number;
}

export interface CreateDeportistaDTO {
  nombre: string;
  apellido: string;
  dni: string;
  fechaNac: string;
  categoria?: string;
  obraSocial?: string;
  disciplinaId: number;
  email: string;
  password: string;
  domicilio: CreateDomicilioDTO;
  telefonos?: string[];
  enfermedadIds?: number[];
}

export interface UpdateDeportistaDTO {
  nombre?: string;
  apellido?: string;
  fechaNac?: string;
  categoria?: string;
  obraSocial?: string;
  disciplinaId?: number;
  domicilio?: Partial<CreateDomicilioDTO>;
  telefonos?: string[];
  enfermedadIds?: number[];
}

// =============================================================================
// GRUPO FAMILIAR DTOs
// =============================================================================

export interface GrupoFamiliarIntegranteDTO {
  deportistaId: number;
  vinculo: Vinculo;
  esPrincipal?: boolean;
}

export interface CreateGrupoFamiliarDTO {
  nombre: string;
  integrantes: GrupoFamiliarIntegranteDTO[];
}

export interface UpdateGrupoFamiliarDTO {
  nombre?: string;
  integrantes?: GrupoFamiliarIntegranteDTO[];
}

// =============================================================================
// CUOTA DTOs
// =============================================================================

export interface CreateCuotaDTO {
  nroCuota: number;
  monto: number;
  fechaEmision: string;
  fechaVencimiento: string;
  periodicidad?: Periodicidad;
  disciplinaId: number;
  deportistaId: number;
}

export interface UpdateCuotaDTO {
  monto?: number;
  fechaVencimiento?: string;
  periodicidad?: Periodicidad;
}

export interface AsignarCuotaDTO {
  deportistaId: number;
  nroCuota: number;
  monto: number;
  fechaEmision: string;
  fechaVencimiento: string;
  disciplinaId: number;
}

// =============================================================================
// PAGO DTOs
// =============================================================================

export interface CreatePagoDTO {
  cuotaId: number;
  medioPago?: string;
}

// =============================================================================
// DISCIPLINA DTOs
// =============================================================================

export interface CreateDisciplinaDTO {
  nombre: string;
  descripcion?: string;
  precioMensual: number;
}

export interface UpdateDisciplinaDTO {
  nombre?: string;
  descripcion?: string;
  precioMensual?: number;
  activa?: boolean;
}

// =============================================================================
// LOCALIDAD DTOs
// =============================================================================

export interface CreateLocalidadDTO {
  codigoPostal: string;
  nombre: string;
}

// =============================================================================
// ENFERMEDAD DTOs
// =============================================================================

export interface CreateEnfermedadDTO {
  nombre: string;
  descripcion?: string;
}
