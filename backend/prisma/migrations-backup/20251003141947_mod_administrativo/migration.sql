/*
  Warnings:

  - Changed the type of `dni` on the `Administrativo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Administrativo" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "dni",
ADD COLUMN     "dni" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Administrativo_dni_key" ON "public"."Administrativo"("dni");
