import prisma from '../config/prisma';

// CU06 - Consultar Historial de Pagos
export interface HistorialPago {
  id: number;
  fecha: string;
  monto: number;
  estado: string;
  mes: string;
  disciplina: string;
}

export async function getHistorialPagos(deportistaId: number): Promise<HistorialPago[]> {
  const pagos = await prisma.pago.findMany({
    where: {
      id_deportista: deportistaId,
    },
    include: {
      cuota: {
        include: {
          disciplina: {
            select: {
              nombre: true
            }
          }
        }
      }
    },
    orderBy: { fechaPago: 'desc' },
  });

  return pagos.map((pago) => ({
    id: pago.id_pago,
    fecha: pago.fechaPago.toISOString().split('T')[0],
    monto: Number(pago.cuota.monto),
    estado: pago.estadoPago,
    mes: pago.cuota.mes || '',
    disciplina: pago.cuota.disciplina.nombre,
  }));
}
