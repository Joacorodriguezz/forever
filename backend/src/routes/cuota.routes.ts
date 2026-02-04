import { Router } from 'express';
import { cuotaController } from '../controllers/cuota.controller';
import {
  authenticateToken,
  requireAdministrativo,
  requireDeportista,
} from '../middlewares/auth.middleware';
import { validateBody, validateParams, validateQuery } from '../middlewares/validation.middleware';
import { asignarCuotaSchema, updateCuotaSchema, cuotasQuerySchema } from '../validators/cuota.validator';
import { idParamSchema } from '../validators/user.validator';

const router = Router();

// GET /api/cuotas/predefinidas - CU10 Consultar cuotas predefinidas
router.get(
  '/predefinidas',
  authenticateToken,
  requireAdministrativo,
  cuotaController.getPredefinidas.bind(cuotaController)
);

// GET /api/cuotas/mi-estado - CU07 Estado de cuenta del deportista logueado
router.get(
  '/mi-estado',
  authenticateToken,
  requireDeportista,
  cuotaController.getMiEstadoCuenta.bind(cuotaController)
);

// POST /api/cuotas/asignar - CU04 Asignar cuota (solo Administrativo)
router.post(
  '/asignar',
  authenticateToken,
  requireAdministrativo,
  validateBody(asignarCuotaSchema),
  cuotaController.asignar.bind(cuotaController)
);

// GET /api/cuotas/deportista/:deportistaId - Cuotas de un deportista
router.get(
  '/deportista/:deportistaId',
  authenticateToken,
  requireAdministrativo,
  validateQuery(cuotasQuerySchema),
  cuotaController.getByDeportista.bind(cuotaController)
);

// GET /api/cuotas/estado-cuenta/:deportistaId - CU07 Estado de cuenta
router.get(
  '/estado-cuenta/:deportistaId',
  authenticateToken,
  requireAdministrativo,
  cuotaController.getEstadoCuenta.bind(cuotaController)
);

// GET /api/cuotas/:id - Obtener cuota
router.get(
  '/:id',
  authenticateToken,
  validateParams(idParamSchema),
  cuotaController.getById.bind(cuotaController)
);

// PUT /api/cuotas/:id - CU05 Actualizar cuota (solo Administrativo)
router.put(
  '/:id',
  authenticateToken,
  requireAdministrativo,
  validateParams(idParamSchema),
  validateBody(updateCuotaSchema),
  cuotaController.update.bind(cuotaController)
);

export default router;
