import prisma from '../config/prisma';
import { GetComprobanteDetalleResponse, UpdateEstadoCuotaRequest, UpdateEstadoCuotaResponse } from '../types/cuota';

const toDDMMYYYY = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;


export async function getCuotaDetalle(id: number): Promise<GetComprobanteDetalleResponse> {
  const cuota = await prisma.cuota.findUnique({
    where: { id_cuota: id },
    include: {
      deportista: {
        select: {
          nombre: true,
          apellido: true
        }
      },
      disciplina: {
        select: {
          nombre: true
        }
      }
    },
  });

  if (!cuota) throw new Error('Cuota no encontrada');

  return {
    id: cuota.id_cuota,
    socioNombre: `${cuota.deportista.nombre} ${cuota.deportista.apellido}`,
    mes: cuota.mes || '',
    monto: Number(cuota.monto),
    estado: cuota.estadoCuota,
  };
}

export async function updateEstadoCuota(
  id: number,
  body: UpdateEstadoCuotaRequest,
  adminName: string
): Promise<UpdateEstadoCuotaResponse> {
  const cuota = await prisma.cuota.findUnique({ where: { id_cuota: id } });
  if (!cuota) throw new Error('Cuota no encontrada');

  const nuevoEstado =
    body.estado === 'Aprobada'
      ? 'PAGADA'
      : 'PENDIENTE';

  const yaEstaba = cuota.estadoCuota === nuevoEstado;

  await prisma.cuota.update({
    where: { id_cuota: id },
    data: { estadoCuota: nuevoEstado },
  });

  return {
    id: cuota.id_cuota,
    estado: body.estado,
    fechaCambio: toDDMMYYYY(new Date()),
    cambiadoPor: adminName,
    ...(yaEstaba ? { message: 'El estado ya estaba asignado' } : {}),
  };
}
