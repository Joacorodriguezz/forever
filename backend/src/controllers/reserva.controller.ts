import { Request, Response, NextFunction } from "express";
import * as reservaService from "../services/reserva.service";
import { CrearReservaDTO, FiltroReservas } from "../types/reserva.types";

// Obtener deportes disponibles desde la tabla Actividad
export async function obtenerDeportesDisponibles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const deportes = await reservaService.obtenerDeportesDisponibles();
    
    res.json({
      deportes,
      total: deportes.length
    });
  } catch (error) {
    console.error("Error en obtenerDeportesDisponibles:", error);
    next(error);
  }
}

// Obtener canchas disponibles para un deporte específico
export async function obtenerCanchasPorDeporte(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { deporte } = req.params;
    
    if (!deporte) {
      return res.status(400).json({
        error: "Parámetro requerido faltante",
        details: "deporte es obligatorio"
      });
    }

    const canchas = await reservaService.obtenerCanchasPorDeporte(deporte);
    
    res.json({
      canchas,
      total: canchas.length,
      deporte
    });
  } catch (error) {
    console.error("Error en obtenerCanchasPorDeporte:", error);
    next(error);
  }
}

// Obtener turnos disponibles para un deporte y fecha específica
export async function obtenerTurnosDisponibles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { deporte, fecha, socioId, cancha } = req.query;
    
    // Validar parámetros requeridos
    if (!deporte || !fecha) {
      return res.status(400).json({
        error: "Parámetros requeridos faltantes",
        details: "deporte y fecha son obligatorios"
      });
    }

    // Validar formato de fecha
    const fechaObj = new Date(fecha as string);
    if (isNaN(fechaObj.getTime())) {
      return res.status(400).json({
        error: "Formato de fecha inválido",
        details: "Use formato YYYY-MM-DD"
      });
    }

    const turnos = await reservaService.obtenerTurnosDisponibles(
      deporte as string,
      fecha as string,
      socioId ? parseInt(socioId as string) : undefined,
      cancha as string
    );

    res.json({
      turnos,
      total: turnos.length,
      deporte,
      fecha,
      cancha: cancha || `Cancha por defecto para ${deporte}`
    });
  } catch (error) {
    console.error("Error en obtenerTurnosDisponibles:", error);
    next(error);
  }
}

// Obtener todas las reservas con filtros opcionales
export async function obtenerReservas(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filtros: FiltroReservas = {};
    
    if (req.query.cancha) filtros.cancha = req.query.cancha as string;
    if (req.query.deporte) filtros.deporte = req.query.deporte as string;
    if (req.query.fecha) filtros.fecha = req.query.fecha as string;
    if (req.query.socioId) filtros.socioId = parseInt(req.query.socioId as string);
    if (req.query.estado) filtros.estado = req.query.estado as any;

    const reservas = await reservaService.obtenerReservas(filtros);

    res.json({
      reservas,
      total: reservas.length
    });
  } catch (error) {
    console.error("Error en obtenerReservas:", error);
    next(error);
  }
}

// Obtener solo reservas activas y futuras de un socio
export async function obtenerReservasActivasFuturas(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const socioId = parseInt(req.query.socioId as string);
    
    if (isNaN(socioId)) {
      return res.status(400).json({
        error: "socioId inválido",
        details: "El socioId debe ser un número"
      });
    }

    const reservas = await reservaService.obtenerReservasActivasFuturas(socioId);

    res.json({
      reservas,
      total: reservas.length
    });
  } catch (error) {
    console.error("Error en obtenerReservasActivasFuturas:", error);
    next(error);
  }
}

// Obtener una reserva por ID
export async function obtenerReservaPorId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({
        error: "ID inválido",
        details: "El ID debe ser un número"
      });
    }

    const reserva = await reservaService.obtenerReservaPorId(id);
    
    if (!reserva) {
      return res.status(404).json({
        error: "Reserva no encontrada",
        details: `No existe una reserva con ID ${id}`
      });
    }

    res.json({ reserva });
  } catch (error) {
    console.error("Error en obtenerReservaPorId:", error);
    next(error);
  }
}

// Crear una nueva reserva
export async function registrarReserva(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data: CrearReservaDTO = req.body;
    
    // Validar datos requeridos
    if (!data.deporte || !data.fecha || !data.hora || !data.socioId) {
      return res.status(400).json({
        error: "Datos requeridos faltantes",
        details: "deporte, fecha, hora y socioId son obligatorios"
      });
    }

    // Validar formato de fecha
    const fechaObj = new Date(data.fecha);
    if (isNaN(fechaObj.getTime())) {
      return res.status(400).json({
        error: "Formato de fecha inválido",
        details: "Use formato YYYY-MM-DD"
      });
    }

    // Validar formato de hora
    const horaRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!horaRegex.test(data.hora)) {
      return res.status(400).json({
        error: "Formato de hora inválido",
        details: "Use formato HH:MM (24 horas)"
      });
    }

    // Validar que socioId sea un número
    if (typeof data.socioId !== 'number' || data.socioId <= 0) {
      return res.status(400).json({
        error: "socioId inválido",
        details: "socioId debe ser un número positivo"
      });
    }

    const nuevaReserva = await reservaService.registrarReserva(data);
    
    res.status(201).json({
      message: "Reserva creada exitosamente",
      reserva: nuevaReserva
    });
  } catch (error) {
    console.error("Error en registrarReserva:", error);
    
    if (error instanceof Error) {
      if (error.message === 'El turno ya está reservado') {
        return res.status(409).json({
          error: "Turno no disponible",
          details: error.message
        });
      }
      if (error.message === 'Socio no encontrado') {
        return res.status(404).json({
          error: "Socio no encontrado",
          details: error.message
        });
      }
    }
    
    next(error);
  }
}

// Cancelar una reserva (cambiar estado a CANCELADA)
export async function cancelarReserva(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({
        error: "ID inválido",
        details: "El ID debe ser un número"
      });
    }

    const reservaCancelada = await reservaService.cancelarReserva(id);
    
    res.json({
      message: "Reserva cancelada exitosamente",
      reserva: reservaCancelada
    });
  } catch (error) {
    console.error("Error en cancelarReserva:", error);
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({
        error: "Reserva no encontrada",
        details: `No existe una reserva con ID ${req.params.id}`
      });
    }
    
    next(error);
  }
}

// Actualizar una reserva (principalmente para cambiar estado)
export async function actualizarReserva(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({
        error: "ID inválido",
        details: "El ID debe ser un número"
      });
    }

    const data = req.body;
    const reservaActualizada = await reservaService.actualizarReserva(id, data);
    
    res.json({
      message: "Reserva actualizada exitosamente",
      reserva: reservaActualizada
    });
  } catch (error) {
    console.error("Error en actualizarReserva:", error);
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return res.status(404).json({
        error: "Reserva no encontrada",
        details: `No existe una reserva con ID ${req.params.id}`
      });
    }
    
    next(error);
  }
}
