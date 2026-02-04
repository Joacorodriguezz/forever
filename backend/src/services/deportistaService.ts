import { ActualizarDeportistaRequest, GetDeportistaResponse } from '../types/Deportista';
import prisma from '../config/prisma';
import { EstadoDeportista } from '@prisma/client';

export async function getDeportistaByDni(dni: number): Promise<{ id: number } | null> {
  const deportista = await prisma.deportista.findFirst({
    where: { dni },
    select: {
      id_deportista: true,
    }
  });

  return deportista ? { id: deportista.id_deportista } : null;
}


// Obtener datos completos del deportista por DNI
export async function getDeportistaCompletoByDni(dni: number): Promise<GetDeportistaResponse | null> {
  const deportista = await prisma.deportista.findUnique({
    where: { dni },
    select: {
      id_deportista: true,
      nombre: true,
      apellido: true,
      dni: true,
      fechaNac: true,
      estado: true,
      categoria: true,
      obraSocial: true,
      id_cuenta: true,
      id_disciplina: true,
      id_domicilio: true,
      sexo: true,
      fotoCarnet: true,
    },
  });

  if (!deportista) return null;

  return {
    id: deportista.id_deportista,
    nombre: deportista.nombre,
    apellido: deportista.apellido,
    dni: deportista.dni,
    fechaNacimiento: deportista.fechaNac,
    estado: deportista.estado,
    categoria: deportista.categoria,
    obraSocial: deportista.obraSocial,
    id_cuenta: deportista.id_cuenta,
    id_disciplina: deportista.id_disciplina,
    id_domicilio: deportista.id_domicilio,
    sexo: deportista.sexo ?? null,
    fotoCarnet: deportista.fotoCarnet ?? null,
  };
}


export async function deleteDeportistaByDni(dni: number) {
  try {
    const deportistaEliminado = await prisma.deportista.delete({
      where: {
        dni: dni,
      },
    });
    return deportistaEliminado;
  } catch (error) {
    console.error(`Error al eliminar deportista con DNI ${dni}:`, error);
    throw new Error('No se pudo eliminar el deportista o no fue encontrado.');
  }
}


export const updateDeportistaEstado = async (id: number, estado: 'AL_DIA' | 'EN_DEUDA' | 'MOROSA' | 'INACTIVA') => {
  try {
    const deportistaActualizado = await prisma.deportista.update({
      where: { id_deportista: id },
      data: { estado: estado as EstadoDeportista },
    });
    return deportistaActualizado;
  } catch (error) {
    throw error;
  }
};

export const getAllDeportistas = async () => {
  return await prisma.deportista.findMany();
};

export const updateDeportista = async (dni: number, data: any) => {
  const updateData: any = {
    nombre: data.nombre,
    apellido: data.apellido,
    fechaNac: new Date(data.fechaNacimiento),
    categoria: data.categoria,
    obraSocial: data.obraSocial,
  };

  if (data.estado) {
    updateData.estado = data.estado as EstadoDeportista;
  }

  if (data.id_disciplina) {
    updateData.id_disciplina = data.id_disciplina;
  }

  if (data.id_domicilio !== undefined) {
    updateData.id_domicilio = data.id_domicilio;
  }

  if (data.sexo !== undefined) {
    updateData.sexo = data.sexo;
  }

  if (data.fotoCarnet !== undefined) {
    updateData.fotoCarnet = data.fotoCarnet;
  }

  return await prisma.deportista.update({
    where: { dni: dni },
    data: updateData,
  });
};
