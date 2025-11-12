/*
  Warnings:

  - You are about to drop the column `ubicacion` on the `Evento` table. All the data in the column will be lost.
  - Added the required column `actividadId` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canchaId` to the `Evento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evento" DROP COLUMN "ubicacion",
ADD COLUMN     "actividadId" INTEGER NOT NULL,
ADD COLUMN     "canchaId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "Actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "Cancha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
