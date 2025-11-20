import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import * as historialController from '../controllers/historial.controller';

const router = Router();

// CU06 - Consultar Historial
router.get(
  '/',
  authenticate,
  authorize('SOCIO'),
  historialController.getHistorial
);

export const historialRoutes = router;

