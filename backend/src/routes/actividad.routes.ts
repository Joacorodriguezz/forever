import { Router } from "express";
import * as actividadController from "../controllers/actividad.controller";
import { validate } from "../middlewares/validation.middleware";
import { createActividadSchema, updateActividadSchema } from "../validations/actividades.validation";
import { authenticate, authorize } from '../middlewares/auth.middleware';
const router = Router();

router.get("/", 
    authenticate,
    actividadController.getAllActividades);
router.get("/:id", 
    authenticate,
    actividadController.getActividadById);
router.post("/", 
    authenticate,
    authorize('ADMIN', 'ADMINISTRATIVO'),
    validate(createActividadSchema), actividadController.createActividad);
router.put("/:id",
    authenticate,
    authorize('ADMIN', 'ADMINISTRATIVO'),
    validate(updateActividadSchema), actividadController.updateActividad);
router.delete("/:id", 
    authenticate,
    authorize('ADMIN', 'ADMINISTRATIVO'),
    actividadController.deleteActividad);

export const ActividadRoutes = router;
