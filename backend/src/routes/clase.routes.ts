import { Router } from "express";
import * as claseController from "../controllers/clase.controller";
import { validate } from "../middlewares/validation.middleware";
import { createClaseSchema, updateClaseSchema } from "../validations/clase.validation";
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get("/actividad/:actividadId",
    authenticate,
    claseController.getClasesByActividad);

router.get("/:id",
    authenticate,
    claseController.getClase);

router.post("/actividad/:actividadId", 
    authenticate,
    authorize('ADMIN', 'ADMINISTRATIVO'),
    validate(createClaseSchema), claseController.createClase);

router.put("/:id", 
    authenticate,
    authorize('ADMIN', 'ADMINISTRATIVO'),
    validate(updateClaseSchema), claseController.updateClase);

router.delete("/:id",
    authenticate,
    authorize('ADMIN', 'ADMINISTRATIVO'),
    claseController.deleteClase);

export const ClaseRoutes = router;
