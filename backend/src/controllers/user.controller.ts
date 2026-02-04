import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { CreateUserRequest, UpdateUserRequest } from '../types/user';
import { supabase } from '../utils/supabaseClient';

//creo que no se usa. podria eliminarse 
export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ users, total: users.length });
  } catch (error: any) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ message: 'Error al obtener usuarios' });
  }
}

// Obtener todos los administrativos
export async function getAdministrativos(req: Request, res: Response) {
  try {
    const administrativos = await userService.getAdministrativos();
    res.json({
      success: true,
      data: administrativos,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener administrativos',
    });
  }
}

// Obtener todos los deportistas
export async function getDeportistas(req: Request, res: Response) {
  try {
    const deportistas = await userService.getAllDeportistas();
    res.json({ success: true, data: deportistas });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Error al obtener deportistas",
    });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await userService.getUserById(id);
    return res.status(200).json({ user });
  } catch (error: any) {
    console.error('Error al obtener usuario:', error);
    return res
      .status(error.statusCode || 404)
      .json({ message: error.message || 'Usuario no encontrado' });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.id);

    let fotoCarnetUrl: string | undefined = undefined;

    if (req.file) {
      // Verificar que Supabase esté configurado
      if (!process.env.SUPABASE_URL) {
        throw new Error('Supabase no está configurado. Configure la variable de entorno SUPABASE_URL.');
      }

      const ext = req.file.originalname.split(".").pop();
      const fileName = `foto-${userId}-${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
        .from("fotos-carnet")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (error)
        throw new Error("Error al subir foto carnet: " + error.message);

      const { data: publicData } = supabase.storage
        .from("fotos-carnet")
        .getPublicUrl(fileName);

      fotoCarnetUrl = publicData.publicUrl;
    }

    const bodyData = { ...req.body };

    if (fotoCarnetUrl) {
      if (!bodyData.deportista) bodyData.deportista = {};
      bodyData.deportista.fotoCarnet = fotoCarnetUrl;
    }

    const updated = await userService.updateUser(userId, bodyData);

    res.json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: updated,
    });
  } catch (error: any) {
    console.error("❌ Error en updateUser:", error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Error al actualizar usuario",
    });
  }
}



export async function deleteUser(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    await userService.deleteUser(id);
    return res.status(200).json({ message: 'Usuario eliminado con éxito' });
  } catch (error: any) {
    console.error('Error al eliminar usuario:', error);
    return res
      .status(error.statusCode || 404)
      .json({ message: error.message || 'Error al eliminar usuario' });
  }
}

// CU16 - Consultar Perfil
export async function getOwnProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'No autenticado' });
    }

    const profile = await userService.getOwnProfile(userId);
    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    console.error('Error al obtener perfil:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error al obtener perfil',
    });
  }
}

// CU17 - Modificar Perfil
export async function updateOwnProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'No autenticado' });
    }

    const updated = await userService.updateOwnProfile(userId, req.body);
    return res.status(200).json({
      success: true,
      message: 'Perfil actualizado correctamente',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error al actualizar perfil:', error);
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Error al actualizar perfil',
    });
  }
}