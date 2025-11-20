import prisma from '../config/prisma';
import { estado_cuota } from '@prisma/client';

// CU11 - Generar Reporte de Deportistas
export interface ReporteDeportista {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  email: string;
  estado: string;
  actividades: string[];
  ultimoPago?: string;
  montoAdeudado: number;
  cuotasPendientes: number;
  cuotasVencidas: number;
}

export async function generarReporteDeportistas(): Promise<ReporteDeportista[]> {
  const socios = await prisma.socio.findMany({
    where: { estado: 'ACTIVO' },
    include: {
      usuario: true,
      actividades: {
        include: {
          actividad: {
            select: { nombre: true },
          },
        },
      },
      Cuota: {
        where: {
          estado: {
            in: [estado_cuota.PENDIENTE, estado_cuota.VENCIDA],
          },
        },
        orderBy: { fecha_vencimiento: 'desc' },
      },
    },
  });

  return socios.map((socio) => {
    const actividades = socio.actividades.map((a) => a.actividad.nombre);
    const cuotasPendientes = socio.Cuota.filter((c) => c.estado === estado_cuota.PENDIENTE).length;
    const cuotasVencidas = socio.Cuota.filter((c) => c.estado === estado_cuota.VENCIDA).length;
    const montoAdeudado = socio.Cuota.reduce((sum, c) => sum + Number(c.monto), 0);
    
    const ultimaCuotaPagada = socio.Cuota.find((c) => c.estado === estado_cuota.PAGADA && c.fecha_pago);
    const ultimoPago = ultimaCuotaPagada?.fecha_pago 
      ? ultimaCuotaPagada.fecha_pago.toISOString().split('T')[0]
      : undefined;

    return {
      id: socio.id,
      nombre: socio.nombre,
      apellido: socio.apellido,
      dni: socio.dni,
      email: socio.email,
      estado: socio.estado,
      actividades,
      ultimoPago,
      montoAdeudado,
      cuotasPendientes,
      cuotasVencidas,
    };
  });
}

// CU12 - Consultar Deportistas con Pagos Pendientes
export interface DeportistaPagoPendiente {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  email: string;
  montoTotal: number;
  cuotas: Array<{
    id: number;
    mes: string;
    monto: number;
    fechaVencimiento: string;
    estado: string;
  }>;
}

export async function getDeportistasConPagosPendientes(): Promise<DeportistaPagoPendiente[]> {
  const socios = await prisma.socio.findMany({
    where: {
      estado: 'ACTIVO',
      Cuota: {
        some: {
          estado: {
            in: [estado_cuota.PENDIENTE, estado_cuota.VENCIDA],
          },
        },
      },
    },
    include: {
      Cuota: {
        where: {
          estado: {
            in: [estado_cuota.PENDIENTE, estado_cuota.VENCIDA],
          },
        },
        orderBy: { fecha_vencimiento: 'asc' },
      },
    },
  });

  return socios.map((socio) => {
    const montoTotal = socio.Cuota.reduce((sum, c) => sum + Number(c.monto), 0);
    
    return {
      id: socio.id,
      nombre: socio.nombre,
      apellido: socio.apellido,
      dni: socio.dni,
      email: socio.email,
      montoTotal,
      cuotas: socio.Cuota.map((c) => ({
        id: c.id,
        mes: c.mes || '',
        monto: Number(c.monto),
        fechaVencimiento: c.fecha_vencimiento.toISOString().split('T')[0],
        estado: c.estado,
      })),
    };
  });
}

