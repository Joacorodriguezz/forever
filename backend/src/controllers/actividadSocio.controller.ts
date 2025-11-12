import { Request, Response, NextFunction } from "express";
import * as actividadSocioService from "../services/actividadSocio.service";
import { Actividad } from '../types/actividad';

export async function getAllActividadesSocio(req: Request, res: Response, next: NextFunction) {
  try {
    const actividadSocios = await actividadSocioService.getAllActividadSocio();
    res.json({ actividadSocios, total: actividadSocios.length });
  } catch (error) {
    next(error);
  }
}

export async function getSociosPorActividad(req: Request, res: Response, next: NextFunction) {
  try {
    const actividadId = Number(req.params.actividadId);
    const actividadSocios = await actividadSocioService.getSociosPorActividad(actividadId);
    res.json({ actividadSocios });
  } catch (error) {
    next(error);
  }
}

export async function getActividadesPorSocio(req: Request, res: Response, next: NextFunction) {
  try {
    const socioId = Number(req.params.socioId);
    const actividadSocio = await actividadSocioService.getActividadesPorSocio(socioId);
    res.json( actividadSocio );
  } catch (error) {
    next(error);
  }
}

export async function getActividadSocioById(req: Request, res: Response, next: NextFunction) {
  try {
    const actividadSocio = await actividadSocioService.getActividadSocioById(Number(req.params.id));
    res.json({ actividadSocio, message: "ActividadSocio encontrada correctamente" });
  } catch (error) {
    next(error);
  }
}

export async function createActividadSocio(req: Request, res: Response, next: NextFunction) {
  try {
    const actividadSocio = await actividadSocioService.createActividadSocio(req.body);
    res.status(201).json({ actividadSocio, message: "ActividadSocio creada correctamente" });
  } catch (error) {
    next(error);
  }
}

export async function updateActividadSocio(req: Request, res: Response, next: NextFunction) {
  try {
    const actividadSocio = await actividadSocioService.updateActividadSocio(Number(req.params.id), req.body);
    res.json({ actividadSocio, message: "ActividadSocio actualizada correctamente" });
  } catch (error) {
    next(error);
  }
}

export async function deleteActividadSocio(req: Request, res: Response, next: NextFunction) {
  try {
    await actividadSocioService.deleteActividadSocio(Number(req.params.id));
    res.json({ message: "ActividadSocio eliminada correctamente" });
  } catch (error) {
    next(error);
  }
}
