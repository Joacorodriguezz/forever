import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import * as userService from '../services/user.service';
import { RegisterSchema } from '../validations/user.validation';

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    console.error("Error en login:", err);
    res.status(401).json({
      success: false,
      message: err.message || 'Error en login',
    });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const parsed = RegisterSchema.parse(req.body);

    let user;

    if (parsed.role === 'DEPORTISTA') {
      user = await userService.registerDeportista({
        nombre: parsed.deportista!.nombre,
        apellido: parsed.deportista!.apellido,
        dni: parsed.deportista!.dni,
        mail: parsed.mail, // Changed from email
        contrasena: parsed.contrasena, // Changed from password
        fechaNacimiento: parsed.deportista!.fechaNacimiento.toISOString(),
        categoria: parsed.deportista!.categoria,
        obraSocial: parsed.deportista!.obraSocial,
        id_disciplina: parsed.deportista!.id_disciplina,
        id_domicilio: parsed.deportista!.id_domicilio,
        sexo: parsed.deportista!.sexo,
        fotoCarnet: parsed.deportista!.fotoCarnet ?? null,
      });
    } else if (parsed.role === 'ADMINISTRATIVO') {
      user = await userService.createAdministrativo({
        mail: parsed.mail, // Changed from email
        contrasena: parsed.contrasena, // Changed from password
        administrativo: parsed.administrativo!,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Rol no soportado' });
    }

    res.status(201).json({
      success: true,
      message: 'Registro exitoso',
      data: user,
    });
  } catch (error: any) {
    console.error("Error en register:", error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Error en el registro',
      errors: error.errors || null,
    });
  }
}
