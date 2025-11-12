/*
  Warnings:

  - You are about to drop the column `estado` on the `Entrada` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Evento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Entrada" DROP COLUMN "estado";

-- AlterTable
ALTER TABLE "public"."Evento" DROP COLUMN "estado";

-- DropEnum
DROP TYPE "public"."EstadoEntrada";
