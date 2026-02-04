import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { PagarCuotaSchema } from '../validations/pago.validation';
import * as pagoController from '../controllers/pago.controller';

const router = Router();

// CU08 - Pagar Cuota
router.post(
  '/',
  authenticate,
  authorize('DEPORTISTA'),
  validate(PagarCuotaSchema),
  pagoController.pagarCuota
);

export const pagoRoutes = router;

