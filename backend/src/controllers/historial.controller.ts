import { Request, Response } from 'express';
import * as historialService from '../services/historial.service';

// CU06 - Consultar Historial
export async function getHistorial(req: Request, res: Response) {
  try {
    const socioId = (req as any).user?.socioId;
    
    if (!socioId) {
      return res.status(400).json({
        success: false,
        message: 'Usuario no es un socio',
      });
    }

    const historial = await historialService.getHistorialPagos(socioId);

    if (historial.length === 0) {
      return res.json({
        success: true,
        message: 'No hay registros de pagos',
        data: [],
      });
    }

    res.json({
      success: true,
      data: historial,
    });
  } catch (error: any) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener historial',
    });
  }
}

