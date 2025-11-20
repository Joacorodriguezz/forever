import prisma from '../config/prisma';
import { estado_cuota } from '@prisma/client';

// CU06 - Consultar Historial de Pagos
export interface HistorialPago {
  id: number;
  fecha: string;
  monto: number;
  medioDePago: string;
  estado: string;
  mes: string;
  comprobanteUrl?: string;
}

export async function getHistorialPagos(socioId: number): Promise<HistorialPago[]> {
  const cuotas = await prisma.cuota.findMany({
    where: {
      socio_id: socioId,
      estado: estado_cuota.PAGADA,
    },
    include: {
      comprobantes: {
        where: { activo: true },
        select: { url: true },
      },
    },
    orderBy: { fecha_pago: 'desc' },
  });

  return cuotas.map((cuota) => ({
    id: cuota.id,
    fecha: cuota.fecha_pago ? cuota.fecha_pago.toISOString().split('T')[0] : '',
    monto: Number(cuota.monto),
    medioDePago: cuota.metodo_pago,
    estado: cuota.estado,
    mes: cuota.mes || '',
    comprobanteUrl: cuota.comprobantes[0]?.url,
  }));
}

