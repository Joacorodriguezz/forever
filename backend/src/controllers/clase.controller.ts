import { Request, Response, NextFunction } from "express";
import * as claseService from "../services/clase.service";
import { CreateClaseRequest } from "../types/clase";

export async function getClasesByActividad(req: Request, res: Response, next: NextFunction) {
  try {
    const clases = await claseService.getClasesByActividad(Number(req.params.actividadId));
    res.json({ clases });
  } catch (error) {
    next(error);
  }
}

export async function getClase(req: Request, res: Response, next: NextFunction) {
  try {
    const clase = await claseService.getClaseById(Number(req.params.id));
    res.json({ clase, message: "Clase encontrada" });
  } catch (error) {
    next(error);
  }
}

export async function createClase(req: Request<{ actividadId: string }, {}, CreateClaseRequest>, res: Response, next: NextFunction) {
  try {
    const actividadId = Number(req.params.actividadId); 
    const clase = await claseService.createClase(actividadId, req.body);
    res.status(201).json({ clase, message: "Clase creada correctamente" });
  } catch (error) {
    next(error);
  }
}


export async function updateClase(req: Request, res: Response, next: NextFunction) {
  try {
    const clase = await claseService.updateClase(Number(req.params.id), req.body);
    res.json({ clase, message: "Clase actualizada correctamente" });
  } catch (error) {
    next(error);
  }
}

export async function deleteClase(req: Request, res: Response, next: NextFunction) {
  try {
    await claseService.deleteClase(Number(req.params.id));
    res.json({ message: "Clase eliminada correctamente" });
  } catch (error) {
    next(error);
  }
}
