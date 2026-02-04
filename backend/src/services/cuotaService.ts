import { PrismaClient, estado_cuota, $Enums } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { supabase } from '../utils/supabaseClient';
import {
  CuotaDeportistaDTO,
  CuotaAdministrativoDTO,
  CuotaAdminDTO,
  GetCuotasAdministrativoQuery,
  EnviarComprobanteResponse,
  GenerarCuotasRequest,
  GenerarCuotasResponse,
  UpdateEstadoCuotaRequest,
  UpdateEstadoCuotaResponse,
  PreviewItem,
  DetalleCuota,
  Mes,
  EstadoCuota,
} from '../types/cuota';

import prisma from '../config/prisma';

export const toDDMMYYYY = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ------------------------------------------------------------------
// 🧮 Función auxiliar: determinar estado según vencimiento
// ------------------------------------------------------------------
function determinarEstadoCuota(vencimiento: Date): $Enums.estado_cuota {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return vencimiento >= hoy ? estado_cuota.PENDIENTE : estado_cuota.VENCIDA;
}

// DEPORTISTA
export async function getCuotasDeportista(deportistaId: number): Promise<CuotaDeportistaDTO[]> {
  const cuotas = await prisma.cuota.findMany({
    where: { deportista_id: deportistaId },
    include: {
      // Traigo todos los comprobantes y filtro en memoria para evitar problemas de compatibilidad
      comprobantes: { select: { url: true, subido_en: true, activo: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  return cuotas.map((c) => {
    const compAct = (c as any).comprobantes?.find((x: any) => x.activo);
    return {
      id: c.id,
      mes: c.mes!,
      monto: Number(c.monto),
      estado: c.estado,
      comprobanteUrl: compAct?.url,
      fechaCarga: compAct?.subido_en ? toDDMMYYYY(compAct.subido_en) : undefined,
      fechaVencimiento: c.fecha_vencimiento ? c.fecha_vencimiento.toISOString() : undefined,
      message: compAct ? undefined : 'Comprobante no cargado',
    };
  });
}

// Subida de comprobante (DEPORTISTA)
export async function enviarComprobante(
  cuotaId: number,
  file: Express.Multer.File
): Promise<EnviarComprobanteResponse> {
  const cuota = await prisma.cuota.findUnique({ where: { id: cuotaId } });
  if (!cuota) throw new Error('Cuota no encontrada');

  // Validar formato y tamaño
  if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/i))
    throw new Error('Formato inválido (solo JPG, PNG o PDF)');
  if (file.size > 5 * 1024 * 1024)
    throw new Error('Archivo demasiado grande (máx 5MB)');

  // Verificar que Supabase esté configurado
  if (!process.env.SUPABASE_URL) {
    throw new Error('Supabase no está configurado. Configure la variable de entorno SUPABASE_URL.');
  }

  // Subir al bucket de Supabase (soporta multer disk o memory)
  const bucket ='comprobante-cuota';
  const ext = file.originalname.split('.').pop();
  const fileName = `comprobante-cuota-${cuotaId}-${Date.now()}.${ext}`;

  const buffer = (file as any).buffer
    ? (file as any).buffer
    : fs.readFileSync((file as any).path);

  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw new Error(`Error al subir comprobante: ${error.message}`);

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  const publicUrl = publicData.publicUrl;


  await prisma.comprobante.upsert({
    where: { cuotaId_activo: { cuotaId, activo: true } },
    update: { url: publicUrl, activo: true },
    create: { cuotaId, url: publicUrl, activo: true },
  });

  await prisma.cuota.update({
    where: { id: cuotaId },
    data: { estado: estado_cuota.EN_REVISION },
  });

  return { success: true, message: 'Comprobante enviado correctamente', url: publicUrl };
}

//  ADMINISTRATIVO
export async function getCuotasAdministrativo(
  filtros: GetCuotasAdministrativoQuery
): Promise<CuotaAdministrativoDTO[]> {
  const where: any = {};
  if (filtros.estado && filtros.estado !== 'Todas') where.estado = filtros.estado;
  if (filtros.nombre) {
    where.Deportista = {
      OR: [
        { nombre: { contains: filtros.nombre, mode: 'insensitive' } },
        { apellido: { contains: filtros.nombre, mode: 'insensitive' } },
      ],
    };
  }

  const cuotas = await prisma.cuota.findMany({
    where,
    include: {
      Deportista: { select: { nombre: true, apellido: true, dni: true , fotoCarnet: true} },
      comprobantes: { where: { activo: true }, select: { url: true, subido_en: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  return cuotas.map((c) => ({
    id: c.id,
    deportistaNombre: `${c.Deportista.nombre} ${c.Deportista.apellido}`,
    dni: c.Deportista.dni,
    mes: c.mes!,
    monto: Number(c.monto),
    estado: c.estado,
    comprobanteUrl: c.comprobantes?.[0]?.url,
    fechaCarga: c.comprobantes?.[0]?.subido_en
      ? toDDMMYYYY(c.comprobantes[0].subido_en)
      : undefined,
    fotoCarnet: c.Deportista.fotoCarnet ?? null,
  }));
}

// Cambiar estado de cuota (ADMINISTRATIVO)
export async function updateEstadoCuota(
  id: number,
  body: UpdateEstadoCuotaRequest,
  adminName: string
): Promise<UpdateEstadoCuotaResponse> {
  const cuota = await prisma.cuota.findUnique({ where: { id } });
  if (!cuota) throw new Error('Cuota no encontrada');

  const esAprobada = body.estado === 'Aprobada';
  const nuevoEstado = esAprobada ? estado_cuota.PAGADA : estado_cuota.PENDIENTE;

  if (!esAprobada) {
    await prisma.comprobante.updateMany({
      where: { cuotaId: id, activo: true },
      data: { activo: false },
    });
  }

  const yaEstaba = cuota.estado === nuevoEstado;

  await prisma.cuota.update({
    where: { id },
    data: { estado: nuevoEstado },
  });

  return {
    id: cuota.id,
    estado: body.estado,
    fechaCambio: toDDMMYYYY(new Date()),
    cambiadoPor: adminName,
    ...(yaEstaba ? { message: 'El estado ya estaba asignado' } : {}),
  };
}


// ADMIN
export async function getCuotasAdmin(
  filtros?: { estado?: string; nombre?: string }
): Promise<CuotaAdminDTO[]> {
  const where: any = {};

  if (filtros?.estado && filtros.estado !== 'Todas')
    where.estado = filtros.estado;
  if (filtros?.nombre) {
    where.Deportista = {
      OR: [
        { nombre: { contains: filtros.nombre, mode: 'insensitive' } },
        { apellido: { contains: filtros.nombre, mode: 'insensitive' } },
      ],
    };
  }

  const cuotas = await prisma.cuota.findMany({
    where,
    include: {
      Deportista: { select: { id: true, nombre: true, apellido: true, dni: true } },
      comprobantes: { where: { activo: true }, select: { url: true, subido_en: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  return cuotas.map((c) => ({
    id: c.id,
    deportistaId: c.Deportista.id,
    deportistaNombre: `${c.Deportista.nombre} ${c.Deportista.apellido}`,
    dni: c.Deportista.dni,
    mes: c.mes!,
    monto: Number(c.monto),
    estado: c.estado,
    comprobanteUrl: c.comprobantes?.[0]?.url,
    fechaCarga: c.comprobantes?.[0]?.subido_en
      ? `${c.comprobantes[0].subido_en.getDate().toString().padStart(2, '0')}/${
          (c.comprobantes[0].subido_en.getMonth() + 1).toString().padStart(2, '0')
        }/${c.comprobantes[0].subido_en.getFullYear()}`
      : undefined,
    creadoEn: `${c.created_at.getDate().toString().padStart(2, '0')}/${
      (c.created_at.getMonth() + 1).toString().padStart(2, '0')
    }/${c.created_at.getFullYear()}`,
  }));
}


// Generar cuotas (ADMIN)
export async function generarCuotas(
  data: GenerarCuotasRequest
): Promise<GenerarCuotasResponse> {
  const { actividadId, mes, montoBase, preview } = data;

  // 🔹 Traer deportistas activos
  const deportistas = await prisma.deportista.findMany({
    where: { estado: 'AL_DIA' },
  });

  let created = 0;
  let updated = 0;
  let skips = 0;
  const previewItems: PreviewItem[] = [];

  // 🔹 Procesar cada deportista
  for (const deportista of deportistas) {
    // 1️⃣ Buscar sus actividades (todas o filtradas)
    const actividadesDeportista = await prisma.deportistaDisciplina.findMany({
      where: {
        deportistaId: deportista.id,
        ...(actividadId ? { disciplinaId: actividadId } : {}),
      },
      include: {
        disciplina: {
          select: { id: true, nombre: true, precioMensual: true, activa: true },
        },
      },
    });

    if (!actividadesDeportista.length) {
      skips++;
      continue;
    }

    // 2️⃣ Calcular total y armar detalle
    const detalle: DetalleCuota[] = [];

    if (montoBase > 0) {
      detalle.push({ tipo: 'base' as const, monto: montoBase });
    }

    for (const a of actividadesDeportista) {
      detalle.push({
        tipo: 'actividad' as const,
        id: a.disciplina.id,
        nombre: a.disciplina.nombre,
        monto: Number(a.disciplina.precioMensual),
      });
    }

    const total = detalle.reduce((acc, d) => acc + d.monto, 0);

    // 3️⃣ Si es solo previsualización → no toca BD
    if (preview) {
      previewItems.push({ deportistaId: deportista.id, total, detalle });
      continue;
    }

    // 4️⃣ Ver si ya existe una cuota para ese mes
    const existente = await prisma.cuota.findFirst({
      where: { deportista_id: deportista.id, mes },
      include: { cuotaXactividad: true },
    });

    if (!existente) {
      // 5️⃣ Crear nueva cuota con detalle
      await prisma.cuota.create({
        data: {
          deportista_id: deportista.id,
          mes,
          monto: total,
          metodo_pago: $Enums.FormaDePago.EFECTIVO,
          estado: $Enums.estado_cuota.PENDIENTE,
          fecha_vencimiento: addDays(new Date(), 45),
          cuotaXactividad: {
            create: detalle
              .filter((d) => d.tipo === 'actividad')
              .map((d) => ({
                actividadId: d.id!,
                monto: d.monto,
              })),
          },
        },
      });
      created++;
    } else {
      // 6️⃣ Actualizar cuota existente
      await prisma.cuota.update({
        where: { id: existente.id },
        data: {
          monto: total,
          // Recalcular fecha de vencimiento en base a created_at
          fecha_vencimiento: addDays(existente.created_at, 45),
          cuotaXactividad: {
            deleteMany: {}, // limpiar previas
            create: detalle
              .filter((d) => d.tipo === 'actividad')
              .map((d) => ({
                actividadId: d.id!,
                monto: d.monto,
              })),
          },
        },
      });
      updated++;
    }
  }

  // 7️⃣ Devolver resultado
  return {
    processedDeportistas: deportistas.length,
    created,
    updated,
    skips,
    ...(preview ? { previewItems } : {}),
  };
}

// Eliminar cuota
export async function deleteCuota(id: number) {
  await prisma.cuota.delete({ where: { id } });
}

// Marcar cuotas vencidas (ADMIN/JOB)
export async function marcarCuotasVencidas(): Promise<{ updated: number }>{
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const res = await prisma.cuota.updateMany({
    where: {
      fecha_vencimiento: { lt: hoy },
      NOT: { estado: $Enums.estado_cuota.PAGADA },
    },
    data: { estado: $Enums.estado_cuota.VENCIDA },
  });

  return { updated: res.count };
}

// CU10 - Consultar Cuotas Predefinidas
export interface CuotaPredefinida {
  id: number;
  mes: Mes;
  monto: number;
  fechaVencimiento: string;
  estado: EstadoCuota;
  numero: number;
  emision: string;
  deportistaNombre: string;
}

export async function getCuotasPredefinidas(): Promise<CuotaPredefinida[]> {
  const cuotas = await prisma.cuota.findMany({
    where: {
      estado: { in: [estado_cuota.PENDIENTE, estado_cuota.VENCIDA] },
    },
    include: {
      Deportista: {
        select: {
          nombre: true,
          apellido: true,
        },
      },
    },
    orderBy: [
      { mes: 'asc' },
      { created_at: 'desc' },
    ],
  });

  return cuotas.map((c, index) => ({
    id: c.id,
    mes: c.mes!,
    monto: Number(c.monto),
    fechaVencimiento: c.fecha_vencimiento.toISOString().split('T')[0],
    estado: c.estado,
    numero: index + 1,
    emision: toDDMMYYYY(c.created_at),
    deportistaNombre: `${c.Deportista.nombre} ${c.Deportista.apellido}`,
  }));
}

// CU04 - Asignar Cuota
export interface AsignarCuotaRequest {
  deportistaId: number;
  mes: Mes;
  monto: number;
  fechaVencimiento: Date;
  actividadId?: number;
}

export async function asignarCuota(data: AsignarCuotaRequest): Promise<CuotaAdminDTO> {
  // Validar que el deportista existe
  const deportista = await prisma.deportista.findUnique({
    where: { id: data.deportistaId },
  });

  if (!deportista) {
    throw new Error('Deportista no encontrado');
  }

  // Validar que no existe una cuota para ese mes
  const existente = await prisma.cuota.findFirst({
    where: {
      deportista_id: data.deportistaId,
      mes: data.mes,
    },
  });

  if (existente) {
    throw new Error('Ya existe una cuota asignada para ese período');
  }

  // Crear la cuota
  const nuevaCuota = await prisma.cuota.create({
    data: {
      deportista_id: data.deportistaId,
      mes: data.mes,
      monto: data.monto,
      fecha_vencimiento: data.fechaVencimiento,
      metodo_pago: $Enums.FormaDePago.EFECTIVO,
      estado: $Enums.estado_cuota.PENDIENTE,
      ...(data.actividadId && {
        cuotaXactividad: {
          create: {
            actividadId: data.actividadId,
            monto: data.monto,
          },
        },
      }),
    },
    include: {
      Deportista: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          dni: true,
        },
      },
      comprobantes: {
        where: { activo: true },
        select: { url: true, subido_en: true },
      },
    },
  });

  return {
    id: nuevaCuota.id,
    deportistaId: nuevaCuota.Deportista.id,
    deportistaNombre: `${nuevaCuota.Deportista.nombre} ${nuevaCuota.Deportista.apellido}`,
    dni: nuevaCuota.Deportista.dni,
    mes: nuevaCuota.mes!,
    monto: Number(nuevaCuota.monto),
    estado: nuevaCuota.estado,
    comprobanteUrl: nuevaCuota.comprobantes?.[0]?.url,
  };
}

// CU05 - Actualizar Cuotas
export interface ActualizarCuotaRequest {
  monto?: number;
  fechaVencimiento?: Date;
  actividadId?: number;
}

export async function actualizarCuota(
  cuotaId: number,
  data: ActualizarCuotaRequest
): Promise<CuotaAdminDTO> {
  const cuota = await prisma.cuota.findUnique({
    where: { id: cuotaId },
    include: {
      Deportista: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          dni: true,
        },
      },
    },
  });

  if (!cuota) {
    throw new Error('Cuota no encontrada');
  }

  // Validaciones
  if (data.monto !== undefined && data.monto <= 0) {
    throw new Error('El monto debe ser mayor a 0');
  }

  const updateData: any = {};
  if (data.monto !== undefined) updateData.monto = data.monto;
  if (data.fechaVencimiento) updateData.fecha_vencimiento = data.fechaVencimiento;

  const cuotaActualizada = await prisma.cuota.update({
    where: { id: cuotaId },
    data: updateData,
    include: {
      Deportista: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          dni: true,
        },
      },
      comprobantes: {
        where: { activo: true },
        select: { url: true, subido_en: true },
      },
    },
  });

  return {
    id: cuotaActualizada.id,
    deportistaId: cuotaActualizada.Deportista.id,
    deportistaNombre: `${cuotaActualizada.Deportista.nombre} ${cuotaActualizada.Deportista.apellido}`,
    dni: cuotaActualizada.Deportista.dni,
    mes: cuotaActualizada.mes!,
    monto: Number(cuotaActualizada.monto),
    estado: cuotaActualizada.estado,
    comprobanteUrl: cuotaActualizada.comprobantes?.[0]?.url,
  };
}

