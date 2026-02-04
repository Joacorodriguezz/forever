
import { Request, Response, NextFunction } from 'express';
import * as cuotaService from '../services/cuotaService';
import { GetCuotasDeportistaResponse, GetCuotasAdministrativoResponse, GetCuotasAdminResponse, EnviarComprobanteResponse, UpdateEstadoCuotaRequest, UpdateEstadoCuotaResponse, GenerarCuotasRequest, GenerarCuotasResponse, } from '../types/cuota';

// DEPORTISTA
export async function getCuotasDeportista(
  req: Request,
  res: Response<GetCuotasDeportistaResponse>,
  next: NextFunction
) {
  try {
    const deportistaIdRaw = (req as any).user?.deportistaId; // viene del token JWT
    console.log('[Cuotas] deportistaId del token:', deportistaIdRaw);
    const deportistaId = Number(deportistaIdRaw);
    if (!deportistaId || Number.isNaN(deportistaId)) {
      return res.status(400).json({ cuotas: [] as any });
    }
    const cuotas = await cuotaService.getCuotasDeportista(deportistaId);
    res.json({ cuotas });
  } catch (error) {
    const msg = (error as any)?.message || String(error);
    console.error('[Cuotas] Error en getCuotasDeportista:', msg);
    res.setHeader('X-Error-Message', msg);
    return res.status(500).json({ cuotas: [] });
  }
}

export async function enviarComprobante(
  req: Request,
  res: Response<EnviarComprobanteResponse>,
  next: NextFunction
) {
  try {
    const cuotaId = Number(req.params.cuotaId);
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'No se proporcionó archivo' });

    const response = await cuotaService.enviarComprobante(cuotaId, file);
    res.json(response);
  } catch (error) {
    next(error);
  }
}

// ADMINISTRATIVO
export async function getCuotasAdministrativo(
  req: Request,
  res: Response<GetCuotasAdministrativoResponse>,
  next: NextFunction
) {
  try {
    const filtros = req.query;
    const cuotas = await cuotaService.getCuotasAdministrativo(filtros);
    res.json({ cuotas });
  } catch (error) {
    next(error);
  }
}

export async function updateEstadoCuota(
  req: Request<{ id: string }, {}, UpdateEstadoCuotaRequest>,
  res: Response<UpdateEstadoCuotaResponse>,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    const adminName = (req as any).user?.nombre || 'Administrador';
    const result = await cuotaService.updateEstadoCuota(id, req.body, adminName);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

// ADMIN
export async function getCuotasAdmin(
  req: Request,
  res: Response<GetCuotasAdminResponse>,
  next: NextFunction
) {
  try {
    const filtros = req.query;
    const cuotas = await cuotaService.getCuotasAdmin(filtros);
    res.json({ cuotas });
  } catch (error) {
    next(error);
  }
}

export async function generarCuotas(
  req: Request<{}, {}, GenerarCuotasRequest>,
  res: Response<GenerarCuotasResponse>,
  next: NextFunction
) {
  try {
    const body = req.body;

    console.log('[Generar cuotas] Datos recibidos:', body);

    const result = await cuotaService.generarCuotas({
      actividadId: body.actividadId ?? undefined, // opcional
      mes: body.mes,
      montoBase: body.montoBase ?? 0,
      preview: !!body.preview, 
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error en generarCuotas controller:', error);
    return next(error);
  }
}

export async function deleteCuota(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await cuotaService.deleteCuota(id);
    res.json({ success: true, message: 'Cuota eliminada' });
  } catch (error) {
    next(error);
  }
}

// ADMIN: ejecutar actualización de cuotas vencidas
export async function runVencimiento(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await cuotaService.marcarCuotasVencidas();
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

// CU10 - Consultar Cuotas Predefinidas
export async function getCuotasPredefinidas(req: Request, res: Response, next: NextFunction) {
  try {
    const cuotas = await cuotaService.getCuotasPredefinidas();
    res.json({
      success: true,
      data: cuotas,
      total: cuotas.length,
    });
  } catch (error) {
    next(error);
  }
}

// CU04 - Asignar Cuota
export async function asignarCuota(req: Request, res: Response, next: NextFunction) {
  try {
    const { deportistaId, mes, monto, fechaVencimiento, actividadId } = req.body;

    if (!deportistaId || !mes || !monto || !fechaVencimiento) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos',
      });
    }

    const cuota = await cuotaService.asignarCuota({
      deportistaId,
      mes,
      monto,
      fechaVencimiento: new Date(fechaVencimiento),
      actividadId,
    });

    res.status(201).json({
      success: true,
      message: 'Cuota asignada correctamente',
      data: cuota,
    });
  } catch (error: any) {
    if (error.message.includes('Ya existe')) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

// CU05 - Actualizar Cuotas
export async function actualizarCuota(req: Request, res: Response, next: NextFunction) {
  try {
    const cuotaId = Number(req.params.id);
    const { monto, fechaVencimiento, actividadId } = req.body;

    const cuota = await cuotaService.actualizarCuota(cuotaId, {
      monto,
      fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : undefined,
      actividadId,
    });

    res.json({
      success: true,
      message: 'Cuota actualizada correctamente',
      data: cuota,
    });
  } catch (error: any) {
    if (error.message.includes('no encontrada') || error.message.includes('mayor a 0')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}