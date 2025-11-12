/*
  Warnings:

  - You are about to drop the column `actividad_id` on the `Cuota` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[socio_id,mes]` on the table `Cuota` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cancha,fecha,hora,estado]` on the table `Reserva` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `metodo_pago` on the `Cuota` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pais` on the `Socio` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."paisesLatam" AS ENUM ('ARGENTINA', 'BOLIVIA', 'BRASIL', 'CHILE', 'COLOMBIA', 'COSTA RICA', 'CUBA', 'ECUADOR', 'EL SALVADOR', 'GUATEMALA', 'HONDURAS', 'MEXICO', 'NICARAGUA', 'PANAMA', 'PARAGUAY', 'PERU', 'PUERTO RICO', 'REPUBLICA DOMINICANA', 'URUGUAY', 'VENEZUELA');

-- DropForeignKey
ALTER TABLE "public"."Cuota" DROP CONSTRAINT "Cuota_actividad_id_fkey";

-- DropIndex
DROP INDEX "public"."id_cuota_actividad";

-- DropIndex
DROP INDEX "public"."id_cuota_socio";

-- DropIndex
DROP INDEX "public"."Reserva_cancha_fecha_hora_key";

-- AlterTable
ALTER TABLE "public"."Cuota" DROP COLUMN "actividad_id",
DROP COLUMN "metodo_pago",
ADD COLUMN     "metodo_pago" "public"."FormaDePago" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Socio" ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
DROP COLUMN "pais",
ADD COLUMN     "pais" "public"."paisesLatam" NOT NULL;

-- DropEnum
DROP TYPE "public"."forma_de_pago";

-- CreateTable
CREATE TABLE "public"."cuotaXactividad" (
    "id" SERIAL NOT NULL,
    "cuotaId" INTEGER NOT NULL,
    "actividadId" INTEGER NOT NULL,
    "monto" DECIMAL(12,3) NOT NULL,

    CONSTRAINT "cuotaXactividad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cuotaXactividad_cuotaId_actividadId_key" ON "public"."cuotaXactividad"("cuotaId", "actividadId");

-- CreateIndex
CREATE UNIQUE INDEX "Cuota_socio_id_mes_key" ON "public"."Cuota"("socio_id", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_cancha_fecha_hora_estado_key" ON "public"."Reserva"("cancha", "fecha", "hora", "estado");

-- AddForeignKey
ALTER TABLE "public"."cuotaXactividad" ADD CONSTRAINT "cuotaXactividad_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "public"."Actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cuotaXactividad" ADD CONSTRAINT "cuotaXactividad_cuotaId_fkey" FOREIGN KEY ("cuotaId") REFERENCES "public"."Cuota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
