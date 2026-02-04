import prisma from '../config/prisma';

// CU08 - Pagar Cuota
export interface PagarCuotaRequest {
  cuotaId: number;
  medioDePago: string; // Changed from enum to string to match schema
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
  medioDePago: string,
  deportistaId: number
): Promise<PagarCuotaResponse> {
  // Validar que la cuota existe y pertenece al deportista
  const cuota = await prisma.cuota.findUnique({
    where: { id_cuota: cuotaId },
    include: {
      deportista: true,
      disciplina: true
    },
  });

  if (!cuota) {
    throw new Error('Cuota no encontrada');
  }

  if (cuota.deportista_id !== deportistaId) {
    throw new Error('La cuota no pertenece al usuario autenticado');
  }

  // Validar estado de la cuota
  if (cuota.estadoCuota !== 'PENDIENTE' && cuota.estadoCuota !== 'VENCIDA') {
    throw new Error('Solo se pueden pagar cuotas pendientes o vencidas');
  }

  // Validar disponibilidad del medio de pago
  const mediosValidos = ['EFECTIVO', 'CBU', 'TRANSFERENCIA', 'TARJETA'];
  if (!mediosValidos.includes(medioDePago.toUpperCase())) {
    throw new Error('Medio de pago no disponible');
  }

  const fechaPago = new Date();

  // Crear registro de pago
  const pago = await prisma.pago.create({
    data: {
      fechaPago: fechaPago,
      estadoPago: 'APROBADO',
      id_cuota: cuotaId,
      id_deportista: deportistaId,
    },
  });

  // Actualizar estado de la cuota
  await prisma.cuota.update({
    where: { id_cuota: cuotaId },
    data: {
      estadoCuota: 'PAGADA',
    },
  });

  return {
    success: true,
    message: 'Pago procesado exitosamente',
    cuotaId,
    fechaPago: fechaPago.toISOString(),
    monto: Number(cuota.monto),
  };
}
