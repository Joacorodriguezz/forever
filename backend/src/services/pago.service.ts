import prisma from '../config/prisma';
import { estado_cuota, FormaDePago } from '@prisma/client';

// CU08 - Pagar Cuota
export interface PagarCuotaRequest {
  cuotaId: number;
  medioDePago: FormaDePago;
}

export interface PagarCuotaResponse {
  success: boolean;
  message: string;
  cuotaId: number;
  fechaPago: string;
  monto: number;
}

export async function pagarCuota(
  cuotaId: number,
  medioDePago: FormaDePago,
  socioId: number
): Promise<PagarCuotaResponse> {
  // Validar que la cuota existe y pertenece al socio
  const cuota = await prisma.cuota.findUnique({
    where: { id: cuotaId },
    include: { Socio: true },
  });

  if (!cuota) {
    throw new Error('Cuota no encontrada');
  }

  if (cuota.socio_id !== socioId) {
    throw new Error('La cuota no pertenece al usuario autenticado');
  }

  if (cuota.estado !== estado_cuota.PENDIENTE && cuota.estado !== estado_cuota.VENCIDA) {
    throw new Error('Solo se pueden pagar cuotas pendientes o vencidas');
  }

  // Validar disponibilidad del medio de pago
  if (![FormaDePago.EFECTIVO, FormaDePago.CBU].includes(medioDePago)) {
    throw new Error('Medio de pago no disponible');
  }

  // Simular procesamiento de pago (aquí se integraría con proveedor externo)
  // Por ahora, solo actualizamos el estado
  const fechaPago = new Date();

  await prisma.cuota.update({
    where: { id: cuotaId },
    data: {
      estado: estado_cuota.PAGADA,
      fecha_pago: fechaPago,
      metodo_pago: medioDePago,
    },
  });

  // Aquí se podría llamar a CU09 - Enviar Notificación
  // await enviarNotificacionPago(cuotaId, cuota.Socio.email);

  return {
    success: true,
    message: 'Pago procesado exitosamente',
    cuotaId,
    fechaPago: fechaPago.toISOString(),
    monto: Number(cuota.monto),
  };
}

