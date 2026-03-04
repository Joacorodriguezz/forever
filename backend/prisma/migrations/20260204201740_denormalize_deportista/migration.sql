/*
  Warnings:

  - You are about to drop the `deportistas_enfermedades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `deportistas_telefonos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `enfermedades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `telefonos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "deportistas_enfermedades" DROP CONSTRAINT "deportistas_enfermedades_id_deportista_fkey";

-- DropForeignKey
ALTER TABLE "deportistas_enfermedades" DROP CONSTRAINT "deportistas_enfermedades_id_enfermedad_fkey";

-- DropForeignKey
ALTER TABLE "deportistas_telefonos" DROP CONSTRAINT "deportistas_telefonos_id_deportista_fkey";

-- DropForeignKey
ALTER TABLE "deportistas_telefonos" DROP CONSTRAINT "deportistas_telefonos_id_telefono_fkey";

-- AlterTable
ALTER TABLE "deportistas" ADD COLUMN     "enfermedades" TEXT,
ADD COLUMN     "telefonos" TEXT;

-- DropTable
DROP TABLE "deportistas_enfermedades";

-- DropTable
DROP TABLE "deportistas_telefonos";

-- DropTable
DROP TABLE "enfermedades";

-- DropTable
DROP TABLE "telefonos";
