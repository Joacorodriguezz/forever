import type { Deportista, CuotaAdmin, GrupoFamiliarAdmin, AdminUser, Disciplina } from '../types/admin';

export const MOCK_DEPORTISTAS: Deportista[] = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', dni: '12345678', disciplina: 'Futbol', genero: 'Masculino', categoria: 'Juveniles', subcategoria: 'Octava', adultoResponsable: { nombre: 'María', apellido: 'Pérez', dni: '23456789', email: 'maria.perez@email.com', telefono: '221-456-7890' }, activo: true },
    { id: 2, nombre: 'María', apellido: 'García', dni: '23456789', disciplina: 'Hockey', genero: 'Femenino', categoria: 'Mayores', subcategoria: 'Primera', adultoResponsable: null, activo: true },
    { id: 3, nombre: 'Pedro', apellido: 'López', dni: '34567890', disciplina: 'Futbol', genero: 'Masculino', categoria: 'Mayores', subcategoria: 'Senior', adultoResponsable: null, activo: false },
];

export const MOCK_CUOTAS_ADMIN: CuotaAdmin[] = [
    { id: 1, deportistaId: 1, deportistaNombre: 'Juan Pérez', disciplina: 'Futbol', genero: 'Masculino', categoria: 'Juveniles', subcategoria: 'Octava', mes: 1, anio: 2026, monto: 10000, formaPago: 'efectivo', estadoCuota: 'PENDIENTE' },
    { id: 2, deportistaId: 1, deportistaNombre: 'Juan Pérez', disciplina: 'Futbol', genero: 'Masculino', categoria: 'Juveniles', subcategoria: 'Octava', mes: 2, anio: 2026, monto: 10000, formaPago: 'sistema', estadoCuota: 'PAGADA', fechaPago: '2026-02-05' },
    { id: 3, deportistaId: 2, deportistaNombre: 'María García', disciplina: 'Hockey', genero: 'Femenino', categoria: 'Mayores', subcategoria: 'Primera', mes: 1, anio: 2026, monto: 10000, formaPago: 'efectivo', estadoCuota: 'PENDIENTE' },
    { id: 4, deportistaId: 2, deportistaNombre: 'María García', disciplina: 'Hockey', genero: 'Femenino', categoria: 'Mayores', subcategoria: 'Primera', mes: 2, anio: 2026, monto: 10000, formaPago: 'efectivo', estadoCuota: 'PENDIENTE' },
];

export const MOCK_GRUPOS_FAMILIARES: GrupoFamiliarAdmin[] = [
    { id: 1, titularDni: '12345678', miembros: [{ id: 1, nombre: 'Juan', apellido: 'Pérez', dni: '12345678' }, { id: 2, nombre: 'María', apellido: 'Pérez', dni: '23456789' }], cuotaHermano: 8000 },
    { id: 2, titularDni: '45678901', miembros: [{ id: 3, nombre: 'Carlos', apellido: 'Rodríguez', dni: '45678901' }, { id: 4, nombre: 'Ana', apellido: 'Rodríguez', dni: '56789012' }], cuotaHermano: 7500 },
];

export const MOCK_ADMINS: AdminUser[] = [
    { id: 1, documento: 'admin', nombre: 'Administrador Principal', activo: true },
    { id: 2, documento: 'caja', nombre: 'Caja', activo: true },
];

export const MOCK_DISCIPLINAS: Disciplina[] = [
    { id: 1, nombre: 'Futbol', valorMensual: 10000, activo: true },
    { id: 2, nombre: 'Hockey', valorMensual: 12000, activo: true },
];
