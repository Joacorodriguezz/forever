import { Router } from 'express';
import { canchaController } from '../controllers/cancha.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createCanchaSchema, updateCanchaSchema } from '../validations/canchas.validation';

const router = Router();

// Lista canchas por actividad
router.get('/actividad/:actividadId', authenticate, canchaController.listarPorActividad);

// Crear cancha
router.post('/', authenticate, authorize('ADMIN', 'ADMINISTRATIVO'), validate(createCanchaSchema), canchaController.crear);

// Actualizar cancha
router.put('/:id', authenticate, authorize('ADMIN', 'ADMINISTRATIVO'), validate(updateCanchaSchema), canchaController.actualizar);

// Eliminar cancha
router.delete('/:id', authenticate, authorize('ADMIN', 'ADMINISTRATIVO'), canchaController.eliminar);

export default router;


