import prisma from '../config/prisma';

// CU11 - Generar Reporte de Deportistas
export interface ReporteDeportista {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  email: string;
  estado: string;
  disciplina: string;
  ultimoPago?: string;
  montoAdeudado: number;
  cuotasPendientes: number;
  cuotasVencidas: number;
}

export async function generarReporteDeportistas(): Promise<ReporteDeportista[]> {
  const deportistas = await prisma.deportista.findMany({
    where: {
      estado: {
        in: ['AL_DIA', 'EN_DEUDA', 'MOROSA']
      }
    },
    include: {
      cuenta: {
        select: {
          mail: true
        }
      },
      disciplina: {
        select: {
          nombre: true
        }
      },
      cuotas: {
        where: {
          estadoCuota: {
            in: ['PENDIENTE', 'VENCIDA'],
          },
        },
        orderBy: { fechaVencimiento: 'desc' },
      },
      pagos: {
        orderBy: { fechaPago: 'desc' },
        take: 1,
      }
    },
  });

  return deportistas.map((deportista) => {
    const cuotasPendientes = deportista.cuotas.filter((c) => c.estadoCuota === 'PENDIENTE').length;
    const cuotasVencidas = deportista.cuotas.filter((c) => c.estadoCuota === 'VENCIDA').length;
    const montoAdeudado = deportista.cuotas.reduce((sum, c) => sum + Number(c.monto), 0);

    const ultimoPago = deportista.pagos[0]?.fechaPago
      ? deportista.pagos[0].fechaPago.toISOString().split('T')[0]
      : undefined;

    return {
      id: deportista.id_deportista,
      nombre: deportista.nombre,
      apellido: deportista.apellido,
      dni: deportista.dni,
      email: deportista.cuenta.mail,
      estado: deportista.estado,
      disciplina: deportista.disciplina.nombre,
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
  const deportistas = await prisma.deportista.findMany({
    where: {
      estado: {
        in: ['AL_DIA', 'EN_DEUDA', 'MOROSA']
      },
      cuotas: {
        some: {
          estadoCuota: {
            in: ['PENDIENTE', 'VENCIDA'],
          },
        },
      },
    },
    include: {
      cuenta: {
        select: {
          mail: true
        }
      },
      cuotas: {
        where: {
          estadoCuota: {
            in: ['PENDIENTE', 'VENCIDA'],
          },
        },
        orderBy: { fechaVencimiento: 'asc' },
      },
    },
  });

  return deportistas.map((deportista) => {
    const montoTotal = deportista.cuotas.reduce((sum, c) => sum + Number(c.monto), 0);

    return {
      id: deportista.id_deportista,
      nombre: deportista.nombre,
      apellido: deportista.apellido,
      dni: deportista.dni,
      email: deportista.cuenta.mail,
      montoTotal,
      cuotas: deportista.cuotas.map((c) => ({
        id: c.id_cuota,
        mes: c.mes || '',
        monto: Number(c.monto),
        fechaVencimiento: c.fechaVencimiento.toISOString().split('T')[0],
        estado: c.estadoCuota,
      })),
    };
  });
}
