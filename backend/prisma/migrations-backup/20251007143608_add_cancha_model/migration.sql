-- CreateTable
CREATE TABLE "public"."Cancha" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "actividadId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cancha_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cancha_actividadId_idx" ON "public"."Cancha"("actividadId");

-- AddForeignKey
ALTER TABLE "public"."Cancha" ADD CONSTRAINT "Cancha_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "public"."Actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
