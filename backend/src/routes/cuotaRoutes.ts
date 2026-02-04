import { Router } from "express";
import multer from "multer";
import { validate, validateSafe } from "../middlewares/validation.middleware";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import * as cuotaController from "../controllers/cuotaController";
import * as cuotaValidation from "../validations/cuotas.validation";
import { AsignarCuotaSchema, ActualizarCuotaSchema } from "../validations/cuota.validation";
import { upload } from '../middlewares/comprobantes.middleware';
const router = Router();


// DEPORTISTA

router.get(
  "/deportista",
  authenticate,
  authorize("DEPORTISTA"),
  validateSafe(cuotaValidation.getCuotasSocioSchema),
  cuotaController.getCuotasDeportista
);

router.post(
  "/deportista/:cuotaId/comprobante",
  authenticate,
  authorize("DEPORTISTA"),
  upload.single("comprobante"),
  validate(cuotaValidation.sendComprobanteSchema),
  cuotaController.enviarComprobante
);

// ADMINISTRATIVO

router.get(
  "/administrativo",
  authenticate,
  authorize("ADMINISTRATIVO", "ADMIN"),
  cuotaController.getCuotasAdministrativo
);

router.patch(
  "/administrativo/:id/estado",
  authenticate,
  authorize("ADMINISTRATIVO", "ADMIN"),
  validate(cuotaValidation.updateEstadoCuotaSchema),
  cuotaController.updateEstadoCuota
);


// ADMIN

router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  cuotaController.getCuotasAdmin
);

router.post(
  "/admin/generar",
  authenticate,
  authorize("ADMIN"),
  validate(cuotaValidation.createCuotaSchema),
  cuotaController.generarCuotas
);

router.post(
  "/admin/vencimiento",
  authenticate,
  authorize("ADMIN"),
  cuotaController.runVencimiento
);

router.delete(
  "/admin/:id",
  authenticate,
  authorize("ADMIN"),
  cuotaController.deleteCuota
);

// CU10 - Consultar Cuotas Predefinidas
router.get(
  "/predefinidas",
  authenticate,
  authorize("ADMINISTRATIVO", "ADMIN"),
  cuotaController.getCuotasPredefinidas
);

// CU04 - Asignar Cuota
router.post(
  "/asignar",
  authenticate,
  authorize("ADMINISTRATIVO", "ADMIN"),
  validate(AsignarCuotaSchema),
  cuotaController.asignarCuota
);

// CU05 - Actualizar Cuotas
router.put(
  "/:id",
  authenticate,
  authorize("ADMINISTRATIVO", "ADMIN"),
  validate(ActualizarCuotaSchema),
  cuotaController.actualizarCuota
);

export const cuotaRoutes = router;
