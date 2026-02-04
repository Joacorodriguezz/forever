import { Router } from 'express';
import { disciplinaController } from '../controllers/disciplina.controller';
import { authenticateToken, requireAdministrativo } from '../middlewares/auth.middleware';
import { validateBody, validateParams } from '../middlewares/validation.middleware';
import { createDisciplinaSchema, updateDisciplinaSchema } from '../validators/disciplina.validator';
import { idParamSchema } from '../validators/user.validator';

const router = Router();

// POST /api/disciplinas - Crear disciplina (solo Administrativo)
router.post(
  '/',
  authenticateToken,
  requireAdministrativo,
  validateBody(createDisciplinaSchema),
  disciplinaController.create.bind(disciplinaController)
);

// GET /api/disciplinas - Listar disciplinas
router.get('/', authenticateToken, disciplinaController.getAll.bind(disciplinaController));

// GET /api/disciplinas/:id - Obtener disciplina
router.get(
  '/:id',
  authenticateToken,
  validateParams(idParamSchema),
  disciplinaController.getById.bind(disciplinaController)
);

// PUT /api/disciplinas/:id - Actualizar disciplina (solo Administrativo)
router.put(
  '/:id',
  authenticateToken,
  requireAdministrativo,
  validateParams(idParamSchema),
  validateBody(updateDisciplinaSchema),
  disciplinaController.update.bind(disciplinaController)
);

// GET /api/disciplinas/:id/deportistas - Deportistas de una disciplina
router.get(
  '/:id/deportistas',
  authenticateToken,
  requireAdministrativo,
  validateParams(idParamSchema),
  disciplinaController.getDeportistas.bind(disciplinaController)
);

export default router;
