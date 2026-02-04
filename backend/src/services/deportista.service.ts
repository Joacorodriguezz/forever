import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { CreateDeportistaDTO, UpdateDeportistaDTO } from '../types/requests';
import { DeportistasQuery } from '../validators/deportista.validator';
import {
  NotFoundError,
  ConflictError,
  ErrorMessages,
} from '../utils/errors';
import { Rol, EstadoDeportista, EstadoCuota } from '@prisma/client';

export class DeportistaService {
  async create(data: CreateDeportistaDTO) {
    // Verificar email único
    const existingEmail = await prisma.cuentaUsuario.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new ConflictError(ErrorMessages.EMAIL_EXISTS);
    }

    // Verificar DNI único
    const existingDni = await prisma.deportista.findUnique({
      where: { dni: data.dni },
    });

    if (existingDni) {
      throw new ConflictError(ErrorMessages.DEPORTISTA_DNI_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const deportista = await prisma.$transaction(async (tx) => {
      // Crear domicilio
      const domicilio = await tx.domicilio.create({
        data: {
          calle: data.domicilio.calle,
          numero: data.domicilio.numero,
          piso: data.domicilio.piso,
          departamento: data.domicilio.departamento,
          localidadId: data.domicilio.localidadId,
        },
      });

      // Crear cuenta
      const cuenta = await tx.cuentaUsuario.create({
        data: {
          email: data.email,
          password: hashedPassword,
          rol: Rol.DEPORTISTA,
        },
      });

      // Crear deportista
      const nuevoDeportista = await tx.deportista.create({
        data: {
          nombre: data.nombre,
          apellido: data.apellido,
          dni: data.dni,
          fechaNac: new Date(data.fechaNac),
          categoria: data.categoria,
          obraSocial: data.obraSocial,
          disciplinaId: data.disciplinaId,
          cuentaId: cuenta.id,
          domicilioId: domicilio.id,
        },
      });

      // Crear teléfonos
      if (data.telefonos && data.telefonos.length > 0) {
        for (const numero of data.telefonos) {
          const telefono = await tx.telefono.create({
            data: { numero },
          });
          await tx.deportistaTelefono.create({
            data: {
              deportistaId: nuevoDeportista.id,
              telefonoId: telefono.id,
            },
          });
        }
      }

      // Asociar enfermedades
      if (data.enfermedadIds && data.enfermedadIds.length > 0) {
        for (const enfermedadId of data.enfermedadIds) {
          await tx.deportistaEnfermedad.create({
            data: {
              deportistaId: nuevoDeportista.id,
              enfermedadId,
            },
          });
        }
      }

      return nuevoDeportista;
    });

    return this.getById(deportista.id);
  }

  async getById(id: number) {
    const deportista = await prisma.deportista.findUnique({
      where: { id },
      include: {
        disciplina: true,
        cuenta: {
          select: {
            id: true,
            email: true,
            rol: true,
            activo: true,
            createdAt: true,
          },
        },
        domicilio: {
          include: { localidad: true },
        },
        telefonos: {
          include: { telefono: true },
        },
        enfermedades: {
          include: { enfermedad: true },
        },
      },
    });

    if (!deportista) {
      throw new NotFoundError(ErrorMessages.DEPORTISTA_NOT_FOUND);
    }

    return deportista;
  }

  async getAll(query: DeportistasQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.estado) {
      where.estado = query.estado as EstadoDeportista;
    }

    if (query.disciplinaId) {
      where.disciplinaId = query.disciplinaId;
    }

    if (query.search) {
      where.OR = [
        { nombre: { contains: query.search, mode: 'insensitive' } },
        { apellido: { contains: query.search, mode: 'insensitive' } },
        { dni: { contains: query.search } },
      ];
    }

    const [deportistas, total] = await Promise.all([
      prisma.deportista.findMany({
        where,
        skip,
        take: limit,
        include: {
          disciplina: true,
          cuenta: {
            select: { email: true, activo: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.deportista.count({ where }),
    ]);

    return {
      data: deportistas,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: number, data: UpdateDeportistaDTO) {
    const deportista = await prisma.deportista.findUnique({
      where: { id },
    });

    if (!deportista) {
      throw new NotFoundError(ErrorMessages.DEPORTISTA_NOT_FOUND);
    }

    await prisma.$transaction(async (tx) => {
      // Actualizar deportista
      await tx.deportista.update({
        where: { id },
        data: {
          nombre: data.nombre,
          apellido: data.apellido,
          fechaNac: data.fechaNac ? new Date(data.fechaNac) : undefined,
          categoria: data.categoria,
          obraSocial: data.obraSocial,
          disciplinaId: data.disciplinaId,
        },
      });

      // Actualizar domicilio si se proporciona
      if (data.domicilio) {
        await tx.domicilio.update({
          where: { id: deportista.domicilioId },
          data: data.domicilio,
        });
      }

      // Actualizar teléfonos si se proporcionan
      if (data.telefonos) {
        await tx.deportistaTelefono.deleteMany({
          where: { deportistaId: id },
        });

        for (const numero of data.telefonos) {
          const telefono = await tx.telefono.create({
            data: { numero },
          });
          await tx.deportistaTelefono.create({
            data: {
              deportistaId: id,
              telefonoId: telefono.id,
            },
          });
        }
      }

      // Actualizar enfermedades si se proporcionan
      if (data.enfermedadIds) {
        await tx.deportistaEnfermedad.deleteMany({
          where: { deportistaId: id },
        });

        for (const enfermedadId of data.enfermedadIds) {
          await tx.deportistaEnfermedad.create({
            data: {
              deportistaId: id,
              enfermedadId,
            },
          });
        }
      }
    });

    return this.getById(id);
  }

  async delete(id: number) {
    const deportista = await prisma.deportista.findUnique({
      where: { id },
    });

    if (!deportista) {
      throw new NotFoundError(ErrorMessages.DEPORTISTA_NOT_FOUND);
    }

    await prisma.deportista.delete({
      where: { id },
    });

    return { message: 'Deportista eliminado correctamente' };
  }

  async getConPagosPendientes() {
    const deportistas = await prisma.deportista.findMany({
      where: {
        cuotas: {
          some: {
            estadoCuota: {
              in: [EstadoCuota.PENDIENTE, EstadoCuota.VENCIDA],
            },
          },
        },
      },
      include: {
        cuotas: {
          where: {
            estadoCuota: {
              in: [EstadoCuota.PENDIENTE, EstadoCuota.VENCIDA],
            },
          },
          orderBy: { fechaVencimiento: 'asc' },
        },
      },
    });

    return deportistas.map((d) => ({
      id: d.id,
      nombre: d.nombre,
      apellido: d.apellido,
      dni: d.dni,
      cantidadCuotasPendientes: d.cuotas.length,
      montoTotalAdeudado: d.cuotas.reduce(
        (sum, c) => sum + Number(c.monto),
        0
      ),
      vencimientoProximo: d.cuotas[0]?.fechaVencimiento || null,
    }));
  }

  async getHistorial(deportistaId: number) {
    const deportista = await prisma.deportista.findUnique({
      where: { id: deportistaId },
    });

    if (!deportista) {
      throw new NotFoundError(ErrorMessages.DEPORTISTA_NOT_FOUND);
    }

    const pagos = await prisma.pago.findMany({
      where: { deportistaId },
      include: {
        cuota: {
          include: { disciplina: true },
        },
      },
      orderBy: { fechaPago: 'desc' },
    });

    return {
      pagos: pagos.map((p) => ({
        id: p.id,
        fecha: p.fechaPago,
        monto: p.monto,
        medioPago: p.medioPago,
        estado: p.estadoPago,
        cuota: {
          nroCuota: p.cuota.nroCuota,
          disciplina: p.cuota.disciplina.nombre,
        },
      })),
    };
  }

  async getByUserId(userId: number) {
    const deportista = await prisma.deportista.findUnique({
      where: { cuentaId: userId },
      include: {
        disciplina: true,
        domicilio: {
          include: { localidad: true },
        },
      },
    });

    if (!deportista) {
      throw new NotFoundError(ErrorMessages.DEPORTISTA_NOT_FOUND);
    }

    return deportista;
  }
}

export const deportistaService = new DeportistaService();
