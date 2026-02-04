import prisma from '../config/prisma';
import { AsignarCuotaDTO, UpdateCuotaDTO } from '../types/requests';
import { CuotasQuery } from '../validators/cuota.validator';
import {
  NotFoundError,
  ConflictError,
  ErrorMessages,
} from '../utils/errors';
import { EstadoCuota, Periodicidad } from '@prisma/client';

export class CuotaService {
  async asignar(data: AsignarCuotaDTO) {
    // Verificar que el deportista existe
    const deportista = await prisma.deportista.findUnique({
      where: { id: data.deportistaId },
    });

    if (!deportista) {
      throw new NotFoundError(ErrorMessages.DEPORTISTA_NOT_FOUND);
    }

    // Verificar que no exista cuota para el mismo período
    const existingCuota = await prisma.cuota.findFirst({
      where: {
        deportistaId: data.deportistaId,
        nroCuota: data.nroCuota,
        disciplinaId: data.disciplinaId,
      },
    });

    if (existingCuota) {
      throw new ConflictError(ErrorMessages.CUOTA_ALREADY_ASSIGNED);
    }

    const cuota = await prisma.cuota.create({
      data: {
        nroCuota: data.nroCuota,
        monto: data.monto,
        fechaEmision: new Date(data.fechaEmision),
        fechaVencimiento: new Date(data.fechaVencimiento),
        disciplinaId: data.disciplinaId,
        deportistaId: data.deportistaId,
      },
      include: {
        disciplina: true,
        deportista: true,
      },
    });

    return cuota;
  }

  async getById(id: number) {
    const cuota = await prisma.cuota.findUnique({
      where: { id },
      include: {
        disciplina: true,
        deportista: true,
        pagos: true,
      },
    });

    if (!cuota) {
      throw new NotFoundError(ErrorMessages.CUOTA_NOT_FOUND);
    }

    return cuota;
  }

  async update(id: number, data: UpdateCuotaDTO) {
    const cuota = await prisma.cuota.findUnique({
      where: { id },
    });

    if (!cuota) {
      throw new NotFoundError(ErrorMessages.CUOTA_NOT_FOUND);
    }

    const updatedCuota = await prisma.cuota.update({
      where: { id },
      data: {
        monto: data.monto,
        fechaVencimiento: data.fechaVencimiento
          ? new Date(data.fechaVencimiento)
          : undefined,
        periodicidad: data.periodicidad as Periodicidad,
      },
      include: {
        disciplina: true,
        deportista: true,
      },
    });

    return updatedCuota;
  }

  async getPredefinidas(disciplinaId?: number) {
    const where: any = {};
    if (disciplinaId) {
      where.disciplinaId = disciplinaId;
    }

    const disciplinas = await prisma.disciplina.findMany({
      where: { activa: true },
      select: {
        id: true,
        nombre: true,
        precioMensual: true,
      },
    });

    return disciplinas.map((d) => ({
      disciplinaId: d.id,
      disciplinaNombre: d.nombre,
      montoMensual: d.precioMensual,
    }));
  }

  async getEstadoCuenta(deportistaId: number) {
    const deportista = await prisma.deportista.findUnique({
      where: { id: deportistaId },
    });

    if (!deportista) {
      throw new NotFoundError(ErrorMessages.DEPORTISTA_NOT_FOUND);
    }

    const cuotas = await prisma.cuota.findMany({
      where: { deportistaId },
      include: {
        pagos: {
          where: { estadoPago: 'APROBADO' },
        },
      },
      orderBy: { nroCuota: 'asc' },
    });

    const cuotasPagadas = cuotas
      .filter((c) => c.estadoCuota === EstadoCuota.PAGADA)
      .map((c) => ({
        id: c.id,
        nroCuota: c.nroCuota,
        monto: c.monto,
        fechaPago: c.pagos[0]?.fechaPago,
        medioPago: c.pagos[0]?.medioPago,
      }));

    const cuotasPendientes = cuotas
      .filter((c) => c.estadoCuota !== EstadoCuota.PAGADA)
      .map((c) => ({
        id: c.id,
        nroCuota: c.nroCuota,
        monto: c.monto,
        fechaVencimiento: c.fechaVencimiento,
        estadoCuota: c.estadoCuota,
      }));

    const totalAdeudado = cuotasPendientes.reduce(
      (sum, c) => sum + Number(c.monto),
      0
    );

    return {
      deportista: {
        id: deportista.id,
        nombre: deportista.nombre,
        apellido: deportista.apellido,
      },
      cuotasPagadas,
      cuotasPendientes,
      totalAdeudado,
    };
  }

  async getByDeportista(deportistaId: number, query: CuotasQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { deportistaId };

    if (query.estado) {
      where.estadoCuota = query.estado as EstadoCuota;
    }

    const [cuotas, total] = await Promise.all([
      prisma.cuota.findMany({
        where,
        skip,
        take: limit,
        include: {
          disciplina: true,
          pagos: true,
        },
        orderBy: { nroCuota: 'desc' },
      }),
      prisma.cuota.count({ where }),
    ]);

    return {
      data: cuotas,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async actualizarVencidas() {
    const now = new Date();

    const result = await prisma.cuota.updateMany({
      where: {
        estadoCuota: EstadoCuota.PENDIENTE,
        fechaVencimiento: { lt: now },
      },
      data: {
        estadoCuota: EstadoCuota.VENCIDA,
      },
    });

    return { actualizadas: result.count };
  }
}

export const cuotaService = new CuotaService();
