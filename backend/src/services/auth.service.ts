import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginRequest } from '../types/auth';
import { EstadoDeportista } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto';

export async function login(data: LoginRequest) {
  const { emailOdni, password } = data;
  let cuentaUsuario;
  let deportista = null;
  let administrativo = null;

  // Buscar usuario según email o DNI
  if (/^\d+$/.test(emailOdni)) {
    // Por DNI
    deportista = await prisma.deportista.findUnique({
      where: { dni: parseInt(emailOdni, 10) },
    });

    if (!deportista) throw new Error("Credenciales inválidas");

    cuentaUsuario = await prisma.cuentaUsuario.findUnique({
      where: { id_cuenta: deportista.id_cuenta },
    });

    if (cuentaUsuario) {
      // Obtener datos relacionados si es necesario
      if (!deportista) {
        deportista = await prisma.deportista.findUnique({
          where: { id_cuenta: cuentaUsuario.id_cuenta },
        });
      }
      administrativo = await prisma.administrativo.findUnique({
        where: { id_cuenta: cuentaUsuario.id_cuenta },
      });
    }
  } else {
    // Por email/mail
    cuentaUsuario = await prisma.cuentaUsuario.findUnique({
      where: { mail: emailOdni },
    });

    if (cuentaUsuario) {
      // Obtener datos relacionados
      deportista = await prisma.deportista.findUnique({
        where: { id_cuenta: cuentaUsuario.id_cuenta },
      });
      administrativo = await prisma.administrativo.findUnique({
        where: { id_cuenta: cuentaUsuario.id_cuenta },
      });
    }
  }

  if (!cuentaUsuario) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  // Validar longitud de contraseña
  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres");
  }

  // ⚠️ Validar estado de deportista
  if (deportista && deportista.estado === EstadoDeportista.INACTIVA) {
    throw new Error("Usuario inhabilitado, contacte al administrador");
  }

  // Validar contraseña
  const passwordValida = await bcrypt.compare(password, cuentaUsuario.contrasena);
  if (!passwordValida) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  // Determinar el rol basado en las relaciones
  let role = 'DEPORTISTA';
  if (administrativo) {
    role = 'ADMINISTRATIVO';
  }
  // You can add logic for ADMIN role based on your requirements

  // Generar token
  const token = jwt.sign(
    { id: cuentaUsuario.id_cuenta, deportistaId: deportista?.id_deportista, role: role, mail: cuentaUsuario.mail },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id_cuenta: cuentaUsuario.id_cuenta,
      mail: cuentaUsuario.mail,
      deportista: deportista,
      administrativo: administrativo,
    },
  };
}
