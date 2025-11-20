import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import * as reporteController from '../controllers/reporte.controller';

const router = Router();

// CU11 - Generar Reporte
router.get(
  '/deportistas',
  authenticate,
  authorize('ADMINISTRATIVO', 'ADMIN'),
  reporteController.generarReporte
);

// CU12 - Consultar Deportistas con Pagos Pendientes
router.get(
  '/deportistas/pagos-pendientes',
  authenticate,
  authorize('ADMINISTRATIVO', 'ADMIN'),
  reporteController.getDeportistasConPagosPendientes
);

export const reporteRoutes = router;

