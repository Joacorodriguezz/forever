import { Request, Response } from 'express';
import { crearPreferenciaPago } from '../services/mercadopago.service';

/**
 * CU08 - Pagar Cuota
 */
export async function pagarCuota(req: Request, res: Response) {
  try {
    const { cuotaId } = req.body;
    const deportistaId = req.user?.socioId;
    const email = req.user?.email;

    if (!deportistaId) {
      return res.status(400).json({
        success: false,
        error: 'No se pudo identificar al deportista'
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'No se pudo obtener el email del usuario'
      });
    }

    // Crear preferencia de pago en Mercado Pago
    const preferencia = await crearPreferenciaPago({
      cuotaId,
      deportistaId,
      email,
    });

    res.json({
      success: true,
      message: 'Preferencia de pago creada',
      data: {
        preferenceId: preferencia.preferenceId,
        initPoint: preferencia.initPoint,
        sandboxInitPoint: preferencia.sandboxInitPoint,
      },
    });
  } catch (error: any) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al procesar el pago'
    });
  }
}

