import { Request, Response, NextFunction } from "express";
import * as actividadService from "../services/actividad.service";

export async function getAllActividades(req: Request, res: Response, next: NextFunction) {
  try {
    const actividades = await actividadService.getAllActividades();
    res.json({ actividades, total: actividades.length });
  } catch (error) {
    next(error);
  }
}

export async function getActividadById(req: Request, res: Response, next: NextFunction) {
  try {
    const actividad = await actividadService.getActividadById(Number(req.params.id));
    res.json({ actividad, message: "Actividad retrieved successfully" });
  } catch (error) {
    next(error);
  }
}

export async function createActividad(req: Request, res: Response, next: NextFunction) {
  try {
    const actividad = await actividadService.createActividad(req.body);
    res.status(201).json({ actividad, message: "Actividad creada correctamente" });
  } catch (error) {
    next(error);
  }
}

export async function updateActividad(req: Request, res: Response, next: NextFunction) {
  try {
    const actividad = await actividadService.updateActividad(Number(req.params.id), req.body);
    res.json({ actividad, message: "Actividad actualizada correctamente" });
  } catch (error) {
    next(error);
  }
}

export async function deleteActividad(req: Request, res: Response, next: NextFunction) {
  try {
    await actividadService.deleteActividad(Number(req.params.id));
    res.json({ message: "Actividad eliminada correctamente" });
  } catch (error) {
    next(error);
  }
}
