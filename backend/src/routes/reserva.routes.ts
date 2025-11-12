import { Router } from "express";
import * as reservaController from "../controllers/reserva.controller";

const router = Router();

// Endpoints para socio
router.get("/socio/deportes", reservaController.obtenerDeportesDisponibles);
router.get("/socio/canchas/:deporte", reservaController.obtenerCanchasPorDeporte);
router.get("/socio/turnos", reservaController.obtenerTurnosDisponibles);
router.get("/socio/reservas", reservaController.obtenerReservas);
router.get("/socio/reservas-activas", reservaController.obtenerReservasActivasFuturas);
router.get("/socio/reservas/:id", reservaController.obtenerReservaPorId);
router.post("/socio/reservas", reservaController.registrarReserva);
router.put("/socio/reservas/:id", reservaController.actualizarReserva);
router.delete("/socio/reservas/:id", reservaController.cancelarReserva);

// Endpoints para admin
router.get("/admin/deportes", reservaController.obtenerDeportesDisponibles);
router.get("/admin/canchas/:deporte", reservaController.obtenerCanchasPorDeporte);
router.get("/admin/turnos", reservaController.obtenerTurnosDisponibles);
router.get("/admin/reservas", reservaController.obtenerReservas);
router.get("/admin/reservas/:id", reservaController.obtenerReservaPorId);
router.post("/admin/reservas", reservaController.registrarReserva);
router.put("/admin/reservas/:id", reservaController.actualizarReserva);
router.delete("/admin/reservas/:id", reservaController.cancelarReserva);

export default router;
