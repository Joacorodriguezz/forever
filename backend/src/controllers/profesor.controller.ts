import { Request, Response, NextFunction } from "express";
import * as profesorService from "../services/profesor.service";

export async function getAllProfesores(req: Request, res: Response, next: NextFunction) {
  try {
    const profesores = await profesorService.getAllProfesores();
    res.json({ profesores, total: profesores.length });
  } catch (error) {
    next(error);
  }
}

export async function getProfesorById(req: Request, res: Response, next: NextFunction) {
  try {
    const profesor = await profesorService.getProfesorById(Number(req.params.id));
    res.json({ profesor, message: "Profesor encontrado" });
  } catch (error) {
    next(error);
  }
}

export async function createProfesor(req: Request, res: Response, next: NextFunction) {
  try {
    const profesor = await profesorService.createProfesor(req.body);
    res.status(201).json({ profesor, message: "Profesor creado correctamente" });
  } catch (error) {
    next(error);
  }
}

export async function updateProfesor(req: Request, res: Response, next: NextFunction) {
  try {
    const profesor = await profesorService.updateProfesor(Number(req.params.id), req.body);
    res.json({ profesor, message: "Profesor actualizado correctamente" });
  } catch (error) {
    next(error);
  }
}

export async function deleteProfesor(req: Request, res: Response, next: NextFunction) {
  try {
    await profesorService.deleteProfesor(Number(req.params.id));
    res.json({ message: "Profesor eliminado correctamente" });
  } catch (error) {
    next(error);
  }
}
