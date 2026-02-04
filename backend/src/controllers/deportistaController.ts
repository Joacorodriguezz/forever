import { Request, Response, NextFunction } from "express";
import * as deportistaService from '../services/deportistaService';
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
    cb(null, `deportista-${dni}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

export async function getDeportistaByDni(req: Request, res: Response) {
  const dni = Number(req.params.dni);
  console.log("Buscando deportista con DNI:", dni);

  if (isNaN(dni)) return res.status(400).json({ error: 'DNI inválido' });

  try {
    const deportista = await deportistaService.getDeportistaCompletoByDni(dni);
    if (!deportista) return res.status(404).json({ error: 'Deportista no encontrado' });
    res.json(deportista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar deportista' });
  }
}

export async function getAllDeportistas(req: Request, res: Response, next: NextFunction) {
  try {
    const deportistas = await deportistaService.getAllDeportistas();
    res.json({ deportistas });
  } catch (error) {
    next(error);
  }
}

export async function getDeportistaCompletoByDni(req: Request, res: Response) {
  const dni = Number(req.params.dni);
  console.log("Buscando deportista completo con DNI:", dni);

  if (isNaN(dni)) return res.status(400).json({ error: 'DNI inválido' });

  try {
    const deportista = await deportistaService.getDeportistaCompletoByDni(dni);
    if (!deportista) return res.status(404).json({ error: 'Deportista no encontrado' });
    res.json(deportista);
  } catch (error) {
    console.error('Error al buscar deportista:', error);
    res.status(500).json({ error: 'Error al buscar deportista' });
  }
}

export async function updateDeportista(req: Request, res: Response) {
  const { dni } = req.body;
  const foto = req.file;

  try {
    // Update deportista data including optional fotoCarnet
    const updateData = {
      ...req.body,
      fotoCarnet: foto ? `/uploads/${foto.filename}` : undefined
    };

    const deportistaActualizado = await deportistaService.updateDeportista(
      Number(dni),
      updateData
    );

    res.json(deportistaActualizado);
  } catch (error) {
    console.error('Error al actualizar deportista:', error);
    res.status(500).json({ error: 'Error al actualizar deportista' });
  }
}

export const updateDeportistaEstado = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { estado } = req.body;

  // Validate estado against EstadoDeportista enum
  const validEstados = ['AL_DIA', 'EN_DEUDA', 'MOROSA', 'INACTIVA'];
  if (!estado || !validEstados.includes(estado)) {
    return res.status(400).json({
      message: "El estado proporcionado no es válido. Debe ser 'AL_DIA', 'EN_DEUDA', 'MOROSA' o 'INACTIVA'."
    });
  }

  try {
    const deportistaActualizado = await deportistaService.updateDeportistaEstado(parseInt(id), estado);
    res.status(200).json(deportistaActualizado);

  } catch (error: any) {
    console.error("Error al actualizar el estado del deportista:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: `Deportista con id ${id} no encontrado.` });
    }
    res.status(500).json({ message: "Error interno del servidor al actualizar el estado." });
  }
};
