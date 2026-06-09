import prisma from '../config/prisma';
import { CreatePagoDTO } from '../types/requests';
import {
  NotFoundError,
  BadRequestError,
  ErrorMessages,
} from '../utils/errors';
import { EstadoPago, EstadoCuota, EstadoDeportista } from '@prisma/client';
import { mercadoPagoService } from './mercadopago.service';

export interface CrearPagoResult {
  pago: Awaited<ReturnType<PagoService['getById']>>;
  checkoutUrl: string;
  publicKey: string;
  preferenceId: string;
}

export class PagoService {
  async crear(deportistaId: number, data: CreatePagoDTO): Promise<CrearPagoResult> {
    const cuota = await prisma.cuota.findUnique({
      where: { id: data.cuotaId },
      include: {
        deportista: true,
        disciplina: true,
      },
    });

    if (!cuota) {
      throw new NotFoundError(ErrorMessages.CUOTA_NOT_FOUND);
    }

    if (cuota.deportistaId !== deportistaId) {
      throw new BadRequestError('La cuota no pertenece al deportista');
    }

    if (cuota.estadoCuota === EstadoCuota.PAGADA) {
      throw new BadRequestError(ErrorMessages.CUOTA_ALREADY_PAID);
    }

    if (cuota.estadoCuota !== EstadoCuota.PENDIENTE && cuota.estadoCuota !== EstadoCuota.VENCIDA) {
      throw new BadRequestError(ErrorMessages.CUOTA_NOT_PENDING);
    }

    const pago = await prisma.pago.create({
      data: {
        fechaPago: new Date(),
        monto: cuota.monto,
        estadoPago: EstadoPago.PENDIENTE,
        medioPago: data.medioPago || 'Mercado Pago',
        cuotaId: cuota.id,
        deportistaId,
      },
      include: {
        cuota: {
          include: { disciplina: true },
        },
        deportista: true,
      },
    });

    const preference = await mercadoPagoService.createPreference({
      pagoId: pago.id,
      cuotaNro: cuota.nroCuota,
      cuotaAnio: cuota.anio,
      disciplinaNombre: cuota.disciplina.nombre,
      monto: Number(cuota.monto),
      deportistaNombre: cuota.deportista.nombre,
      deportistaApellido: cuota.deportista.apellido,
    });

    await prisma.pago.update({
      where: { id: pago.id },
      data: {
        mercadoPagoId: preference.preferenceId,
        mercadoPagoStatus: 'preference_created',
      },
    });

    const pagoActualizado = await this.getById(pago.id);

    return {
      pago: pagoActualizado,
      checkoutUrl: preference.checkoutUrl,
      publicKey: preference.publicKey,
      preferenceId: preference.preferenceId,
    };
  }

  async confirmarPago(pagoId: number, mercadoPagoId: string, status: string) {
    const pago = await prisma.pago.findUnique({
      where: { id: pagoId },
      include: { cuota: true },
    });

    if (!pago) {
      throw new NotFoundError(ErrorMessages.PAGO_NOT_FOUND);
    }

    let estadoPago: EstadoPago;
    if (status === 'approved') {
      estadoPago = EstadoPago.APROBADO;
    } else if (status === 'pending' || status === 'in_process') {
      estadoPago = EstadoPago.PENDIENTE;
    } else {
      estadoPago = EstadoPago.RECHAZADO;
    }

    const linkComprobante =
      estadoPago === EstadoPago.APROBADO && mercadoPagoId
        ? `https://www.mercadopago.com.ar/activities/payments/${mercadoPagoId}`
        : null;

    await prisma.$transaction(async (tx) => {
      await tx.pago.update({
        where: { id: pagoId },
        data: {
          estadoPago,
          mercadoPagoId,
          mercadoPagoStatus: status,
          linkComprobante,
        },
      });

      if (estadoPago === EstadoPago.APROBADO) {
        await tx.cuota.update({
          where: { id: pago.cuotaId },
          data: { estadoCuota: EstadoCuota.PAGADA },
        });

        const cuotasPendientes = await tx.cuota.count({
          where: {
            deportistaId: pago.deportistaId,
            estadoCuota: { in: [EstadoCuota.PENDIENTE, EstadoCuota.VENCIDA] },
          },
        });

        if (cuotasPendientes === 0) {
          await tx.deportista.update({
            where: { id: pago.deportistaId },
            data: { estado: EstadoDeportista.AL_DIA },
          });
        }
      }
    });

    return this.getById(pagoId);
  }

  async getById(id: number) {
    const pago = await prisma.pago.findUnique({
      where: { id },
      include: {
        cuota: {
          include: { disciplina: true },
        },
        deportista: true,
      },
    });

    if (!pago) {
      throw new NotFoundError(ErrorMessages.PAGO_NOT_FOUND);
    }

    return pago;
  }

  async getByMercadoPagoId(mercadoPagoId: string) {
    const pago = await prisma.pago.findUnique({
      where: { mercadoPagoId },
      include: {
        cuota: true,
        deportista: true,
      },
    });

    return pago;
  }

  async getByDeportista(deportistaId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [pagos, total] = await Promise.all([
      prisma.pago.findMany({
        where: { deportistaId },
        skip,
        take: limit,
        include: {
          cuota: {
            include: { disciplina: true },
          },
        },
        orderBy: { fechaPago: 'desc' },
      }),
      prisma.pago.count({ where: { deportistaId } }),
    ]);

    return {
      data: pagos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const pagoService = new PagoService();
