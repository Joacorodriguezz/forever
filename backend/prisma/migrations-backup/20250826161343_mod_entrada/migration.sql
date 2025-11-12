/*
  Warnings:

  - You are about to drop the column `ubicacion` on the `Entrada` table. All the data in the column will be lost.
  - You are about to drop the column `entradasVendidas` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `montoTotal` on the `Evento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Entrada" DROP COLUMN "ubicacion";

-- AlterTable
ALTER TABLE "public"."Evento" DROP COLUMN "entradasVendidas",
DROP COLUMN "montoTotal",
ALTER COLUMN "precioEntrada" SET DATA TYPE DOUBLE PRECISION;
