import { Router } from "express";
import * as actividadSocioController from "../controllers/actividadSocio.controller";
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get("/actividad/:actividadId", 
    authenticate,
    actividadSocioController.getSociosPorActividad);

router.get("/socio/:socioId", 
    authenticate,
    actividadSocioController.getActividadesPorSocio);

router.get("/", 
    authenticate,
    actividadSocioController.getAllActividadesSocio);

router.get("/:id", 
    authenticate,
    actividadSocioController.getActividadSocioById);

router.post("/", 
    authenticate,
    actividadSocioController.createActividadSocio);

router.put("/:id",
    authenticate,
    authorize('ADMIN'),
    actividadSocioController.updateActividadSocio);

router.delete("/:id", 
    authenticate,
    actividadSocioController.deleteActividadSocio);

export const actividadSocioRoutes = router;
