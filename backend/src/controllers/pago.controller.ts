import { Request, Response, NextFunction } from 'express';
import { pagoService } from '../services/pago.service';
import { deportistaService } from '../services/deportista.service';
import { mercadoPagoService } from '../services/mercadopago.service';
import env from '../config/env';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { CreatePagoInput } from '../validators/pago.validator';
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/errors';
import { Rol } from '@prisma/client';

export class PagoController {
  async crear(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body as CreatePagoInput;
      const deportista = await deportistaService.getByUserId(req.user!.id);
      const result = await pagoService.crear(deportista.id, data);
      sendCreated(res, result, 'Pago iniciado correctamente');
    } catch (error) {
      next(error);
    }
  }

  async webhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, data } = req.body;

      if (type === 'payment' && data?.id) {
        const paymentId = String(data.id);
        const paymentInfo = await mercadoPagoService.getPayment(paymentId);

        if (paymentInfo) {
          let pagoId: number | null = null;

          if (paymentInfo.externalReference) {
            pagoId = parseInt(paymentInfo.externalReference, 10);
          }

          if (!pagoId || Number.isNaN(pagoId)) {
            const pagoByMp = await pagoService.getByMercadoPagoId(paymentId);
            if (pagoByMp) {
              pagoId = pagoByMp.id;
            }
          }

          if (pagoId && !Number.isNaN(pagoId)) {
            await pagoService.confirmarPago(pagoId, paymentId, paymentInfo.status);
          }
        }
      }

      sendSuccess(res, { received: true });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const result = await pagoService.getById(id);

      if (req.user!.rol === Rol.DEPORTISTA) {
        const deportista = await deportistaService.getByUserId(req.user!.id);
        if (result.deportistaId !== deportista.id) {
          throw new ForbiddenError('No tenés permiso para ver este pago');
        }
      }

      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async sincronizar(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const { mercadoPagoId, paymentId } = req.body;
      const paymentIdToSync = String(mercadoPagoId || paymentId || '');

      if (!paymentIdToSync) {
        throw new BadRequestError('ID de pago de Mercado Pago requerido');
      }

      const currentPago = await pagoService.getById(id);

      if (req.user!.rol === Rol.DEPORTISTA) {
        const deportista = await deportistaService.getByUserId(req.user!.id);
        if (currentPago.deportistaId !== deportista.id) {
          throw new ForbiddenError('No tenÃ©s permiso para sincronizar este pago');
        }
      }

      const result = await pagoService.sincronizarConMercadoPago(id, paymentIdToSync);
      sendSuccess(res, result, 'Pago sincronizado correctamente');
    } catch (error) {
      next(error);
    }
  }

  async getMisPagos(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const deportista = await deportistaService.getByUserId(req.user!.id);
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const result = await pagoService.getByDeportista(deportista.id, page, limit);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getByDeportista(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const deportistaId = parseInt(req.params.deportistaId as string, 10);
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const result = await pagoService.getByDeportista(deportistaId, page, limit);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async confirmar(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      const { mercadoPagoId, status } = req.body;
      const result = await pagoService.confirmarPago(id, mercadoPagoId, status);
      sendSuccess(res, result, 'Pago confirmado correctamente');
    } catch (error) {
      next(error);
    }
  }

  async simularRetorno(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (env.NODE_ENV === 'production' || mercadoPagoService.isConfigured()) {
        throw new ForbiddenError('La simulacion de pagos no esta disponible');
      }

      const pagoId = parseInt(req.query.pagoId as string, 10);
      const status = (req.query.status as string) || 'approved';
      const redirect = req.query.redirect as string | undefined;

      if (!pagoId || Number.isNaN(pagoId)) {
        throw new NotFoundError('Pago no encontrado');
      }

      if (!['approved', 'pending', 'in_process', 'rejected'].includes(status)) {
        throw new BadRequestError('Estado de pago invalido');
      }

      const mockMpId = `mock_payment_${pagoId}`;
      const result = await pagoService.confirmarPago(pagoId, mockMpId, status);

      if (redirect === 'mobile') {
        res.redirect(`forever://payment/result?pagoId=${pagoId}&status=${status}`);
        return;
      }

      sendSuccess(res, {
        pagoId: result.id,
        status: result.estadoPago,
        message: 'Pago simulado correctamente (sin credenciales de Mercado Pago)',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const pagoController = new PagoController();
