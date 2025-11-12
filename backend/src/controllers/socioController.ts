import { Request, Response, NextFunction } from "express";
import * as socioService from '../services/socioService';
import multer from 'multer';
import path from 'path';

//manejo de la subida de la foto de perfil a la carpeta uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '/uploads'); 
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const { dni } = req.body;
    const ext = path.extname(file.originalname); 
    cb(null, `socio-${dni}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

export async function getSocioByDni(req: Request, res: Response) {
  const dni = Number(req.params.dni);
  console.log("Buscando socio con DNI:", dni);

  if (isNaN(dni)) return res.status(400).json({ error: 'DNI inválido' });

  try {
    const socio = await socioService.getSocioCompletoByDni(dni);
    if (!socio) return res.status(404).json({ error: 'Socio no encontrado' });
    res.json(socio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar socio' });
  }
}

export async function getAllSocios(req: Request, res: Response, next: NextFunction) {
  try {
    const socios = await socioService.getAllSocios();
    res.json({ socios });
  } catch (error) {
    next(error);
  }
}

export async function getSocioCompletoByDni(req: Request, res: Response) {
  const dni = Number(req.params.dni);
  console.log("Buscando socio completo con DNI:", dni);

  if (isNaN(dni)) return res.status(400).json({ error: 'DNI inválido' });

  try {
    const socio = await socioService.getSocioCompletoByDni(dni);
    if (!socio) return res.status(404).json({ error: 'Socio no encontrado' });
    res.json(socio);
  } catch (error) {
    console.error('Error al buscar socio:', error);
    res.status(500).json({ error: 'Error al buscar socio' });
  }
}

export async function updateSocio(req: Request, res: Response) {
  const { dni } = req.body;
  const foto = req.file;

  try {
    let fotoPath = null;
    if (foto) {
      // Asegúrate de que la ruta sea accesible desde el frontend
      fotoPath = `/uploads/${foto.filename}`;
    }

    // --- LÓGICA MODIFICADA PARA LLAMAR AL SERVICIO ---
    const socioActualizado = await socioService.updateSocio(
      Number(dni),
      req.body,
      fotoPath
    );

    res.json(socioActualizado);
  } catch (error) {
    console.error('Error al actualizar socio:', error);
    res.status(500).json({ error: 'Error al actualizar socio' });
  }
}

export const updateSocioEstado = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado || (estado !== 'ACTIVO' && estado !== 'INACTIVO')) {
    return res.status(400).json({ message: "El estado proporcionado no es válido. Debe ser 'ACTIVO' o 'INACTIVO'." });
  }

  try {
    const socioActualizado = await socioService.updateSocioEstado(parseInt(id), estado);
    res.status(200).json(socioActualizado);

  } catch (error: any) {
    console.error("Error al actualizar el estado del socio:", error);
    if (error.code === 'P2025') { 
      return res.status(404).json({ message: `Socio con id ${id} no encontrado.` });
    }
    res.status(500).json({ message: "Error interno del servidor al actualizar el estado." });
  }
};