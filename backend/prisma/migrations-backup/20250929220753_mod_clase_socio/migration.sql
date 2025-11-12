/*
  Warnings:

  - You are about to drop the `ClaseSocio` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ClaseSocio" DROP CONSTRAINT "ClaseSocio_claseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClaseSocio" DROP CONSTRAINT "ClaseSocio_socioId_fkey";

-- DropTable
DROP TABLE "public"."ClaseSocio";

-- CreateTable
CREATE TABLE "public"."ActividadSocio" (
    "id" SERIAL NOT NULL,
    "actividadId" INTEGER NOT NULL,
    "socioId" INTEGER NOT NULL,

    CONSTRAINT "ActividadSocio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActividadSocio_actividadId_socioId_key" ON "public"."ActividadSocio"("actividadId", "socioId");

-- AddForeignKey
ALTER TABLE "public"."ActividadSocio" ADD CONSTRAINT "ActividadSocio_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "public"."Actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActividadSocio" ADD CONSTRAINT "ActividadSocio_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "public"."Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
