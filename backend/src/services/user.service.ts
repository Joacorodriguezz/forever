import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import { CreateUserRequest, UpdateUserRequest, UserData } from '../types/user';
import { EstadoDeportista } from '@prisma/client';

const SALT_ROUNDS = 10;

// Obtener todos los usuarios
export async function getAllUsers(limit: number = 10): Promise<UserData[]> {
  const users = await prisma.cuentaUsuario.findMany({
    take: limit,
    orderBy: { id_cuenta: "asc" },
    include: { deportista: true, administrativo: true },
  });

  return users.map(({ contrasena, ...u }) => ({
    ...u,
  }));
}

// Obtener todos los administrativos
export async function getAdministrativos(): Promise<UserData[]> {
  const cuentas = await prisma.cuentaUsuario.findMany({
    where: { administrativo: { isNot: null } },
    include: { administrativo: true },
  });

  return cuentas.map(({ contrasena, ...resto }) => ({
    ...resto,
  }));
}

// Obtener todos los deportistas
export async function getAllDeportistas(): Promise<UserData[]> {
  const cuentas = await prisma.cuentaUsuario.findMany({
    where: { deportista: { isNot: null } },
    include: { deportista: true },
  });

  return cuentas.map(({ contrasena, ...u }) => ({
    ...u,
  }));
}

// Obtener un usuario por ID
export async function getUserById(id: number): Promise<UserData> {
  const user = await prisma.cuentaUsuario.findUnique({
    where: { id_cuenta: id },
    include: { deportista: true, administrativo: true },
  });

  if (!user) {
    const error = new Error("Usuario no encontrado") as any;
    error.statusCode = 404;
    throw error;
  }

  const { contrasena, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
  };
}

// Crear usuario administrativo
export async function createAdministrativo(data: CreateUserRequest): Promise<UserData> {
  const exists = await prisma.cuentaUsuario.findUnique({ where: { mail: data.mail } });
  if (exists) {
    const error = new Error('Email ya registrado') as any;
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(data.contrasena, SALT_ROUNDS);

  const newUser = await prisma.cuentaUsuario.create({
    data: {
      mail: data.mail,
      contrasena: hashedPassword,
      administrativo: data.administrativo
        ? {
          create: {
            nombre: data.administrativo.nombre,
            apellido: data.administrativo.apellido,
            dni: Number(data.administrativo.dni),
          },
        }
        : undefined,
    },
    include: { administrativo: true },
  });

  const { contrasena, ...userWithoutPassword } = newUser;
  return {
    ...userWithoutPassword,
  };
}

export async function updateUser(
  id: number,
  data: any,
): Promise<UserData> {
  const updateData: any = {};

  if (data.mail) {
    updateData.mail = data.mail;
  }

  if (data.contrasena) {
    updateData.contrasena = await bcrypt.hash(data.contrasena, SALT_ROUNDS);
  }

  if (data.deportista) {
    updateData.deportista = {
      update: data.deportista,
    };
  }

  if (data.administrativo) {
    updateData.administrativo = {
      update: data.administrativo,
    };
  }

  const updatedUser = await prisma.cuentaUsuario.update({
    where: { id_cuenta: id },
    data: updateData,
    include: { deportista: true, administrativo: true },
  });

  const { contrasena, ...userWithoutPassword } = updatedUser;
  return {
    ...userWithoutPassword,
  };
}

// Eliminar usuario 
export async function deleteUser(id: number): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Buscar usuario
    const user = await tx.cuentaUsuario.findUnique({
      where: { id_cuenta: id },
      include: { deportista: true, administrativo: true },
    });

    if (!user) {
      const error = new Error("Usuario no encontrado") as any;
      error.statusCode = 404;
      throw error;
    }

    // Si es DEPORTISTA, eliminar dependencias
    if (user.deportista) {
      const deportistaId = user.deportista.id_deportista;

      // Eliminar pagos
      await tx.pago.deleteMany({ where: { id_deportista: deportistaId } });

      // Eliminar teléfonos
      await tx.telefono.deleteMany({ where: { id_deportista: deportistaId } });

      // Finalmente eliminar el deportista (las relaciones many-to-many se manejan automáticamente)
      await tx.deportista.delete({ where: { id_deportista: deportistaId } });
    }

    // Si es ADMINISTRATIVO, eliminarlo
    if (user.administrativo) {
      await tx.administrativo.delete({ where: { id_administrativo: user.administrativo.id_administrativo } });
    }

    // Finalmente eliminar el usuario
    await tx.cuentaUsuario.delete({ where: { id_cuenta: id } });
  });
}

// Registrar deportista
export async function registerDeportista(data: {
  nombre: string;
  apellido: string;
  dni: number;
  mail: string;
  contrasena: string;
  fechaNacimiento: string;
  categoria: string;
  obraSocial: string;
  id_disciplina: number;
  id_domicilio?: number;
  sexo?: string;
  fotoCarnet?: string;
}): Promise<UserData> {
  const exists = await prisma.cuentaUsuario.findUnique({ where: { mail: data.mail } });
  if (exists) {
    const error = new Error("Email ya registrado") as any;
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(data.contrasena, SALT_ROUNDS);

  const newUser = await prisma.cuentaUsuario.create({
    data: {
      mail: data.mail,
      contrasena: hashedPassword,
      deportista: {
        create: {
          nombre: data.nombre,
          apellido: data.apellido,
          dni: data.dni,
          fechaNac: new Date(data.fechaNacimiento),
          categoria: data.categoria,
          obraSocial: data.obraSocial,
          estado: EstadoDeportista.AL_DIA,
          id_disciplina: data.id_disciplina,
          id_domicilio: data.id_domicilio,
          sexo: data.sexo,
          fotoCarnet: data.fotoCarnet,
        },
      },
    },
    include: { deportista: true },
  });

  const { contrasena, ...userWithoutPassword } = newUser;
  return {
    ...userWithoutPassword,
  };
}

// CU16 - Consultar Perfil (obtener perfil propio)
export async function getOwnProfile(userId: number): Promise<UserData> {
  return getUserById(userId);
}

// CU17 - Modificar Perfil (actualizar perfil propio)
export async function updateOwnProfile(
  userId: number,
  data: {
    mail?: string;
    contrasena?: string;
  }
): Promise<UserData> {
  const updateData: any = {};

  // Validar email único si se está actualizando
  if (data.mail) {
    const emailExists = await prisma.cuentaUsuario.findFirst({
      where: {
        mail: data.mail,
        NOT: { id_cuenta: userId },
      },
    });
    if (emailExists) {
      const error = new Error('El email ya está en uso') as any;
      error.statusCode = 409;
      throw error;
    }
    updateData.mail = data.mail;
  }

  // Actualizar contraseña si se proporciona
  if (data.contrasena) {
    updateData.contrasena = await bcrypt.hash(data.contrasena, SALT_ROUNDS);
  }

  const updatedUser = await prisma.cuentaUsuario.update({
    where: { id_cuenta: userId },
    data: updateData,
    include: { deportista: true, administrativo: true },
  });

  const { contrasena: _, ...userWithoutPassword } = updatedUser;
  return {
    ...userWithoutPassword,
  };
}