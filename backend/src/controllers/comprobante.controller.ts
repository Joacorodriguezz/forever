import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/comprobante.service';
import {
  GetComprobanteDetalleResponse,
  UpdateEstadoCuotaRequest,
  UpdateEstadoCuotaResponse
} from '../types/cuota';

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
