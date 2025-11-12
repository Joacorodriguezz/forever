/*
  Warnings:

  - Added the required column `fecha_vencimiento` to the `Cuota` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cuota" ADD COLUMN     "fecha_vencimiento" DATE NOT NULL;
