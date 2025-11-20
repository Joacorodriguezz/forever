import { Request, Response } from 'express';
import * as reporteService from '../services/reporte.service';

// CU11 - Generar Reporte
export async function generarReporte(req: Request, res: Response) {
  try {
    const deportistas = await reporteService.generarReporteDeportistas();
    res.json({
      success: true,
      data: deportistas,
      total: deportistas.length,
    });
  } catch (error: any) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al generar reporte',
    });
  }
}

// CU12 - Consultar Deportistas con Pagos Pendientes
export async function getDeportistasConPagosPendientes(req: Request, res: Response) {
  try {
    const deportistas = await reporteService.getDeportistasConPagosPendientes();
    
    if (deportistas.length === 0) {
      return res.json({
        success: true,
        message: 'No hay deportistas con pagos pendientes',
        data: [],
      });
    }

    res.json({
      success: true,
      data: deportistas,
      total: deportistas.length,
    });
  } catch (error: any) {
    console.error('Error al obtener deportistas con pagos pendientes:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener deportistas con pagos pendientes',
    });
  }
}

