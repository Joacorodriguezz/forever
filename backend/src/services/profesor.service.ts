import prisma from "../config/prisma";
import { Profesor, CreateProfesorRequest, UpdateProfesorRequest } from "../types/profesor";

export async function getAllProfesores(): Promise<Profesor[]> {
  return prisma.profesor.findMany({ orderBy: { createdAt: "desc" }, include: { clases: true } });
}

export async function getProfesorById(id: number): Promise<Profesor> {
  const profesor = await prisma.profesor.findUnique({ where: { id }, include: { clases: true } });
  if (!profesor) throw new Error("Profesor no encontrado");
  return profesor;
}

export async function createProfesor(data: CreateProfesorRequest): Promise<Profesor> {
  return prisma.profesor.create({ data });
}

export async function updateProfesor(id: number, data: UpdateProfesorRequest): Promise<Profesor> {
  return prisma.profesor.update({ where: { id }, data });
}

export async function deleteProfesor(id: number): Promise<void> {
  await prisma.profesor.delete({ where: { id } });
}
