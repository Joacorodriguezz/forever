import { Router } from 'express';
import * as ctrl from '../controllers/HomeSocioController';
// Aca va el middleware de autenticación

const router = Router();
// Aca va el middleware de autenticación, para proteger todo

router.get('/:id', ctrl.getSocio);
router.get('/:id/estado-cuota', ctrl.getEstadoCuota);
router.get('/:id/accesos', ctrl.getAccesos);

export const socioHomeRoutes = router;
