import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/comprobante.service';
import {
  GetComprobanteDetalleResponse,
  UpdateEstadoCuotaRequest,
  UpdateEstadoCuotaResponse
} from '../types/cuota';
import prisma from '../config/prisma';

export async function getDetalle(
  req: Request,
  res: Response<GetComprobanteDetalleResponse>,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id, 10);
    const data = await svc.getCuotaDetalle(id);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function patchEstado(
  req: Request<{ id: string }, {}, UpdateEstadoCuotaRequest>,
  res: Response<UpdateEstadoCuotaResponse>,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id, 10);
    const adminName = (req as any).user?.nombre || 'Admin';
    const data = await svc.updateEstadoCuota(id, req.body, adminName);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

// CU15 - Descargar Comprobante
export async function descargarComprobante(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cuotaId = parseInt(req.params.id, 10);
    const socioId = (req as any).user?.socioId;
    const userRole = (req as any).user?.role;

    // Validar que la cuota existe
    const cuota = await prisma.cuota.findUnique({
      where: { id: cuotaId },
      include: {
        Socio: true,
        comprobantes: {
          where: { activo: true },
          select: { url: true },
        },
      },
    });

    if (!cuota) {
      return res.status(404).json({
        success: false,
        message: 'Cuota no encontrada',
      });
    }

    // Validar permisos: solo el socio dueño o admin/administrativo
    if (userRole === 'SOCIO' && cuota.socio_id !== socioId) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para acceder a este comprobante',
      });
    }

    // Validar que existe comprobante
    if (!cuota.comprobantes || cuota.comprobantes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comprobante no encontrado',
      });
    }

    const comprobanteUrl = cuota.comprobantes[0].url;

    // Redirigir a la URL del comprobante o devolver la URL
    res.json({
      success: true,
      url: comprobanteUrl,
      message: 'Comprobante disponible',
    });
  } catch (error) {
    next(error);
  }
}
