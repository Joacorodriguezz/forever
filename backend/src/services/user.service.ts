import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { UpdateProfileDTO, AssignRoleDTO } from '../types/requests';
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
  ErrorMessages,
} from '../utils/errors';
import { Rol } from '@prisma/client';

export class UserService {
  async getProfile(userId: number) {
    const cuenta = await prisma.cuentaUsuario.findUnique({
      where: { id: userId },
      include: {
        deportista: {
          include: {
            disciplina: true,
            domicilio: {
              include: { localidad: true },
            },
          },
        },
        administrativo: true,
      },
    });

    if (!cuenta) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }

    const { password, ...cuentaSinPassword } = cuenta;
    return cuentaSinPassword;
  }

  async updateProfile(userId: number, data: UpdateProfileDTO) {
    const cuenta = await prisma.cuentaUsuario.findUnique({
      where: { id: userId },
    });

    if (!cuenta) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }

    // Verificar email único si se está actualizando
    if (data.email && data.email !== cuenta.email) {
      const existingEmail = await prisma.cuentaUsuario.findUnique({
        where: { email: data.email },
      });

      if (existingEmail) {
        throw new ConflictError(ErrorMessages.EMAIL_EXISTS);
      }
    }

    const updateData: { email?: string; password?: string } = {};

    if (data.email) {
      updateData.email = data.email;
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updatedCuenta = await prisma.cuentaUsuario.update({
      where: { id: userId },
      data: updateData,
      include: {
        deportista: true,
        administrativo: true,
      },
    });

    // Si hay teléfono y es deportista, actualizar
    if (data.telefono && updatedCuenta.deportista) {
      await prisma.deportista.update({
        where: { id: updatedCuenta.deportista.id },
        data: { telefonos: data.telefono },
      });
    }

    const { password, ...cuentaSinPassword } = updatedCuenta;
    return cuentaSinPassword;
  }

  async assignRole(_userId: number, targetUserId: number, data: AssignRoleDTO) {
    const targetCuenta = await prisma.cuentaUsuario.findUnique({
      where: { id: targetUserId },
    });

    if (!targetCuenta) {
      throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    }

    // Validar regla de al menos 1 Admin
    if (targetCuenta.rol === Rol.ADMIN && data.rol !== 'ADMIN') {
      const adminCount = await prisma.cuentaUsuario.count({
        where: { rol: Rol.ADMIN, activo: true },
      });

      if (adminCount <= 1) {
        throw new BadRequestError(ErrorMessages.LAST_ADMIN);
      }
    }

    const updatedCuenta = await prisma.cuentaUsuario.update({
      where: { id: targetUserId },
      data: { rol: data.rol as Rol },
    });

    const { password, ...cuentaSinPassword } = updatedCuenta;
    return cuentaSinPassword;
  }

  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.cuentaUsuario.findMany({
        skip,
        take: limit,
        include: {
          deportista: true,
          administrativo: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.cuentaUsuario.count(),
    ]);

    return {
      data: users.map(({ password, ...user }) => user),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const userService = new UserService();
