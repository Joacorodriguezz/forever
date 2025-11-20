import { Request, Response } from 'express';
import * as pagoService from '../services/pago.service';
import * as notificacionService from '../services/notificacion.service';
import prisma from '../config/prisma';

// CU08 - Pagar Cuota
export async function pagarCuota(req: Request, res: Response) {
  try {
    const socioId = (req as any).user?.socioId;
    
    if (!socioId) {
      return res.status(400).json({
        success: false,
        message: 'Usuario no es un socio',
      });
    }

    const { cuotaId, medioDePago } = req.body;

    if (!cuotaId || !medioDePago) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos (cuotaId, medioDePago)',
      });
    }

    const resultado = await pagoService.pagarCuota(cuotaId, medioDePago, socioId);

    // CU09 - Enviar Notificación
    try {
      const cuota = await prisma.cuota.findUnique({
        where: { id: cuotaId },
        include: { Socio: true },
      });

      if (cuota) {
        await notificacionService.notificarPagoConfirmado(
          cuota.Socio.email,
          cuotaId,
          Number(cuota.monto),
          resultado.fechaPago
        );
      }
    } catch (notifError) {
      console.error('Error al enviar notificación:', notifError);
      // No fallar el pago si falla la notificación
    }

    res.json({
      success: true,
      data: resultado,
    });
  } catch (error: any) {
    console.error('Error al procesar pago:', error);
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Error al procesar pago',
    });
  }
}

