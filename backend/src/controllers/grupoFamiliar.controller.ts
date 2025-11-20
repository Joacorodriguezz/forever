import { Request, Response } from 'express';
import * as grupoFamiliarService from '../services/grupoFamiliar.service';

// CU13 - Gestionar Grupo Familiar
export async function crearGrupoFamiliar(req: Request, res: Response) {
  try {
    const grupo = await grupoFamiliarService.crearGrupoFamiliar(req.body);
    res.status(201).json({
      success: true,
      message: 'Grupo familiar creado correctamente',
      data: grupo,
    });
  } catch (error: any) {
    console.error('Error al crear grupo familiar:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Error al crear grupo familiar',
    });
  }
}

export async function getGruposFamiliares(req: Request, res: Response) {
  try {
    const grupos = await grupoFamiliarService.getGruposFamiliares();
    res.json({
      success: true,
      data: grupos,
      total: grupos.length,
    });
  } catch (error: any) {
    console.error('Error al obtener grupos familiares:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener grupos familiares',
    });
  }
}

export async function getGrupoFamiliarById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const grupo = await grupoFamiliarService.getGrupoFamiliarById(id);

    if (!grupo) {
      return res.status(404).json({
        success: false,
        message: 'Grupo familiar no encontrado',
      });
    }

    res.json({
      success: true,
      data: grupo,
    });
  } catch (error: any) {
    console.error('Error al obtener grupo familiar:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener grupo familiar',
    });
  }
}

export async function actualizarGrupoFamiliar(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const grupo = await grupoFamiliarService.actualizarGrupoFamiliar(id, req.body);
    res.json({
      success: true,
      message: 'Grupo familiar actualizado correctamente',
      data: grupo,
    });
  } catch (error: any) {
    console.error('Error al actualizar grupo familiar:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Error al actualizar grupo familiar',
    });
  }
}

export async function eliminarGrupoFamiliar(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    await grupoFamiliarService.eliminarGrupoFamiliar(id);
    res.json({
      success: true,
      message: 'Grupo familiar eliminado correctamente',
    });
  } catch (error: any) {
    console.error('Error al eliminar grupo familiar:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Error al eliminar grupo familiar',
    });
  }
}

