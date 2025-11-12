import { Request, Response, NextFunction } from 'express';
import * as svc from '../services/HomeSocioService';

export async function getSocio(req: Request, res: Response, next: NextFunction) {
  try { res.json(await svc.getSocioById(parseInt(req.params.id, 10))); }
  catch (err) { next(err); }
}
export async function getEstadoCuota(req: Request, res: Response, next: NextFunction) {
  try { res.json(await svc.getEstadoCuota(parseInt(req.params.id, 10))); }
  catch (err) { next(err); }
}
export async function getAccesos(req: Request, res: Response, next: NextFunction) {
  try { res.json(await svc.getAccesos(parseInt(req.params.id, 10))); }
  catch (err) { next(err); }
}
