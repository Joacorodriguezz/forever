import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { CrearGrupoFamiliarSchema, ActualizarGrupoFamiliarSchema } from '../validations/grupoFamiliar.validation';
import * as grupoFamiliarController from '../controllers/grupoFamiliar.controller';

const router = Router();

// CU13 - Gestionar Grupo Familiar (solo ADMINISTRATIVO)
router.post(
  '/',
  authenticate,
  authorize('ADMINISTRATIVO', 'ADMIN'),
  validate(CrearGrupoFamiliarSchema),
  grupoFamiliarController.crearGrupoFamiliar
);

router.get(
  '/',
  authenticate,
  authorize('ADMINISTRATIVO', 'ADMIN'),
  grupoFamiliarController.getGruposFamiliares
);

router.get(
  '/:id',
  authenticate,
  authorize('ADMINISTRATIVO', 'ADMIN'),
  grupoFamiliarController.getGrupoFamiliarById
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMINISTRATIVO', 'ADMIN'),
  validate(ActualizarGrupoFamiliarSchema),
  grupoFamiliarController.actualizarGrupoFamiliar
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMINISTRATIVO', 'ADMIN'),
  grupoFamiliarController.eliminarGrupoFamiliar
);

export const grupoFamiliarRoutes = router;

