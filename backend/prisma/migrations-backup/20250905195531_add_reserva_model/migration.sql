/*
  Warnings:

  - The values [M,F] on the enum `Sexo` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "public"."estado_cuota" AS ENUM ('PENDIENTE', 'VENCIDA', 'PAGADA', 'EN_REVISION');

-- CreateEnum
CREATE TYPE "public"."forma_de_pago" AS ENUM ('TRANSFERENCIA', 'EFECTIVO');

-- CreateEnum
CREATE TYPE "public"."Mes" AS ENUM ('ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE');

-- CreateEnum
CREATE TYPE "public"."EstadoReserva" AS ENUM ('ACTIVA', 'CANCELADA', 'COMPLETADA');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Sexo_new" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');
ALTER TABLE "public"."Socio" ALTER COLUMN "sexo" TYPE "public"."Sexo_new" USING ("sexo"::text::"public"."Sexo_new");
ALTER TYPE "public"."Sexo" RENAME TO "Sexo_old";
ALTER TYPE "public"."Sexo_new" RENAME TO "Sexo";
DROP TYPE "public"."Sexo_old";
COMMIT;

-- CreateTable
CREATE TABLE "public"."Actividad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Clase" (
    "id" SERIAL NOT NULL,
    "diaSemana" "public"."DiaSemana" NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "actividadId" INTEGER NOT NULL,
    "profesorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cuota" (
    "id" SERIAL NOT NULL,
    "fecha_pago" DATE,
    "metodo_pago" "public"."forma_de_pago" NOT NULL,
    "monto" DECIMAL(12,3) NOT NULL,
    "estado" "public"."estado_cuota" NOT NULL DEFAULT 'PENDIENTE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "socio_id" INTEGER NOT NULL,
    "actividad_id" INTEGER NOT NULL,
    "mes" "public"."Mes",

    CONSTRAINT "Cuota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comprobante" (
    "id" SERIAL NOT NULL,
    "cuotaId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "subido_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comprobante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profesor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profesor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClaseSocio" (
    "id" SERIAL NOT NULL,
    "claseId" INTEGER NOT NULL,
    "socioId" INTEGER NOT NULL,

    CONSTRAINT "ClaseSocio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reserva" (
    "id" SERIAL NOT NULL,
    "cancha" TEXT NOT NULL,
    "deporte" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "hora" TEXT NOT NULL,
    "estado" "public"."EstadoReserva" NOT NULL DEFAULT 'ACTIVA',
    "socioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "id_cuota_actividad" ON "public"."Cuota"("actividad_id");

-- CreateIndex
CREATE INDEX "id_cuota_estado" ON "public"."Cuota"("estado");

-- CreateIndex
CREATE INDEX "id_cuota_socio" ON "public"."Cuota"("socio_id");

-- CreateIndex
CREATE UNIQUE INDEX "Comprobante_cuotaId_activo_key" ON "public"."Comprobante"("cuotaId", "activo");

-- CreateIndex
CREATE UNIQUE INDEX "Profesor_email_key" ON "public"."Profesor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClaseSocio_claseId_socioId_key" ON "public"."ClaseSocio"("claseId", "socioId");

-- CreateIndex
CREATE INDEX "Reserva_socioId_idx" ON "public"."Reserva"("socioId");

-- CreateIndex
CREATE INDEX "Reserva_fecha_idx" ON "public"."Reserva"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_cancha_fecha_hora_key" ON "public"."Reserva"("cancha", "fecha", "hora");

-- AddForeignKey
ALTER TABLE "public"."Clase" ADD CONSTRAINT "Clase_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "public"."Actividad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Clase" ADD CONSTRAINT "Clase_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "public"."Profesor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cuota" ADD CONSTRAINT "Cuota_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "public"."Actividad"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Cuota" ADD CONSTRAINT "Cuota_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "public"."Socio"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Comprobante" ADD CONSTRAINT "Comprobante_cuotaId_fkey" FOREIGN KEY ("cuotaId") REFERENCES "public"."Cuota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClaseSocio" ADD CONSTRAINT "ClaseSocio_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "public"."Clase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClaseSocio" ADD CONSTRAINT "ClaseSocio_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "public"."Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reserva" ADD CONSTRAINT "Reserva_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "public"."Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;