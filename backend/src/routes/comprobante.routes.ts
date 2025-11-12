import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import * as comprobanteAdminController from "../controllers/comprobante.controller";

const router = Router();

// Solo ADMIN y ADMINISTRATIVO pueden ver o actualizar comprobantes
router.get(
  "/:id",
  authenticate,
  authorize('ADMIN', 'ADMINISTRATIVO'),
  comprobanteAdminController.getDetalle
);

router.patch(
  "/:id/estado",
  authenticate,
  authorize('ADMIN', 'ADMINISTRATIVO'),
  comprobanteAdminController.patchEstado
);

export const comprobanteRoutes = router;
