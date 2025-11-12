import prisma from '../config/prisma';
import { estado_cuota } from '@prisma/client';
import { GetComprobanteDetalleResponse, UpdateEstadoCuotaRequest, UpdateEstadoCuotaResponse } from '../types/cuota';

const toDDMMYYYY = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;


export async function getCuotaDetalle(id: number): Promise<GetComprobanteDetalleResponse> {
  const cuota = await prisma.cuota.findUnique({
    where: { id },
    include: {
      Socio: { select: { nombre: true, apellido: true } },
      comprobantes: { where: { activo: true }, select: { url: true, subido_en: true } },
    },
  });

  if (!cuota) throw new Error('Cuota no encontrada');

  const comprobanteUrl = cuota.comprobantes?.[0]?.url;

  return {
    id: cuota.id,
    socioNombre: `${cuota.Socio.nombre} ${cuota.Socio.apellido}`,
    mes: cuota.mes!,
    monto: Number(cuota.monto),
    estado: cuota.estado,
    comprobanteUrl,
    fechaCarga: comprobanteUrl
      ? toDDMMYYYY(cuota.comprobantes![0].subido_en)
      : undefined,
    ...(comprobanteUrl ? {} : { message: 'Comprobante no cargado' }),
  };
}

export async function updateEstadoCuota(
  id: number,
  body: UpdateEstadoCuotaRequest,
  adminName: string
): Promise<UpdateEstadoCuotaResponse> {
  const cuota = await prisma.cuota.findUnique({ where: { id } });
  if (!cuota) throw new Error('Cuota no encontrada');

  const nuevoEstado =
    body.estado === 'Aprobada'
      ? estado_cuota.PAGADA
      : estado_cuota.PENDIENTE;

  const yaEstaba = cuota.estado === nuevoEstado;

  await prisma.cuota.update({
    where: { id },
    data: { estado: nuevoEstado },
  });

  return {
    id: cuota.id,
    estado: body.estado,
    fechaCambio: toDDMMYYYY(new Date()),
    cambiadoPor: adminName,
    ...(yaEstaba ? { message: 'El estado ya estaba asignado' } : {}),
  };
}
