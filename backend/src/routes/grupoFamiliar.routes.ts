import { Router } from 'express';
import { grupoFamiliarController } from '../controllers/grupoFamiliar.controller';
import {
  authenticateToken,
  requireAdministrativo,
  requireDeportista,
} from '../middlewares/auth.middleware';
import { validateBody, validateParams } from '../middlewares/validation.middleware';
import {
  createGrupoFamiliarSchema,
  updateGrupoFamiliarSchema,
} from '../validators/grupoFamiliar.validator';
import { idParamSchema } from '../validators/user.validator';

const router = Router();

// GET /api/grupos-familiares/mios - Ver mis grupos familiares (solo Deportista)
router.get(
  '/mios',
  authenticateToken,
  requireDeportista,
  grupoFamiliarController.getMios.bind(grupoFamiliarController)
);

// POST /api/grupos-familiares - CU13 Crear grupo familiar (solo Administrativo)
router.post(
  '/',
  authenticateToken,
  requireAdministrativo,
  validateBody(createGrupoFamiliarSchema),
  grupoFamiliarController.create.bind(grupoFamiliarController)
);

// GET /api/grupos-familiares - Listar grupos familiares
router.get(
  '/',
  authenticateToken,
  requireAdministrativo,
  grupoFamiliarController.getAll.bind(grupoFamiliarController)
);

// GET /api/grupos-familiares/:id - Obtener grupo familiar
router.get(
  '/:id',
  authenticateToken,
  requireAdministrativo,
  validateParams(idParamSchema),
  grupoFamiliarController.getById.bind(grupoFamiliarController)
);

// PUT /api/grupos-familiares/:id - Actualizar grupo familiar
router.put(
  '/:id',
  authenticateToken,
  requireAdministrativo,
  validateParams(idParamSchema),
  validateBody(updateGrupoFamiliarSchema),
  grupoFamiliarController.update.bind(grupoFamiliarController)
);

// DELETE /api/grupos-familiares/:id - Eliminar grupo familiar
router.delete(
  '/:id',
  authenticateToken,
  requireAdministrativo,
  validateParams(idParamSchema),
  grupoFamiliarController.delete.bind(grupoFamiliarController)
);

export default router;
