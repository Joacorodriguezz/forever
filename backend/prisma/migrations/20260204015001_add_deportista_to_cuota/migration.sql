/*
  Warnings:

  - The primary key for the `Administrativo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `activo` on the `Administrativo` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Administrativo` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Administrativo` table. All the data in the column will be lost.
  - You are about to alter the column `nombre` on the `Administrativo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `apellido` on the `Administrativo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - The primary key for the `Cuota` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `Cuota` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Cuota` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_pago` on the `Cuota` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_vencimiento` on the `Cuota` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Cuota` table. All the data in the column will be lost.
  - You are about to drop the column `metodo_pago` on the `Cuota` table. All the data in the column will be lost.
  - You are about to drop the column `socio_id` on the `Cuota` table. All the data in the column will be lost.
  - The `mes` column on the `Cuota` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Actividad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ActividadSocio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cancha` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Clase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comprobante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Entrada` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Evento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profesor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reserva` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Socio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cuotaXactividad` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_cuenta]` on the table `Administrativo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_cuenta` to the `Administrativo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deportista_id` to the `Cuota` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estadoCuota` to the `Cuota` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaEmision` to the `Cuota` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaVencimiento` to the `Cuota` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_disciplina` to the `Cuota` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nroCuota` to the `Cuota` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `monto` on the `Cuota` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EstadoDeportista" AS ENUM ('AL_DIA', 'EN_DEUDA', 'MOROSA', 'INACTIVA');

-- DropForeignKey
ALTER TABLE "public"."ActividadSocio" DROP CONSTRAINT "ActividadSocio_actividadId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ActividadSocio" DROP CONSTRAINT "ActividadSocio_socioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Administrativo" DROP CONSTRAINT "Administrativo_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Cancha" DROP CONSTRAINT "Cancha_actividadId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Clase" DROP CONSTRAINT "Clase_actividadId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Clase" DROP CONSTRAINT "Clase_profesorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comprobante" DROP CONSTRAINT "Comprobante_cuotaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Cuota" DROP CONSTRAINT "Cuota_socio_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Entrada" DROP CONSTRAINT "Entrada_eventoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Entrada" DROP CONSTRAINT "Entrada_socioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Evento" DROP CONSTRAINT "Evento_actividadId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Evento" DROP CONSTRAINT "Evento_canchaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reserva" DROP CONSTRAINT "Reserva_socioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Socio" DROP CONSTRAINT "Socio_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."cuotaXactividad" DROP CONSTRAINT "cuotaXactividad_actividadId_fkey";

-- DropForeignKey
ALTER TABLE "public"."cuotaXactividad" DROP CONSTRAINT "cuotaXactividad_cuotaId_fkey";

-- DropIndex
DROP INDEX "public"."Administrativo_usuarioId_key";

-- DropIndex
DROP INDEX "public"."Cuota_socio_id_mes_key";

-- DropIndex
DROP INDEX "public"."id_cuota_estado";

-- AlterTable
ALTER TABLE "Administrativo" DROP CONSTRAINT "Administrativo_pkey",
DROP COLUMN "activo",
DROP COLUMN "id",
DROP COLUMN "usuarioId",
ADD COLUMN     "id_administrativo" SERIAL NOT NULL,
ADD COLUMN     "id_cuenta" INTEGER NOT NULL,
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "apellido" SET DATA TYPE VARCHAR(50),
ADD CONSTRAINT "Administrativo_pkey" PRIMARY KEY ("id_administrativo");

-- AlterTable
ALTER TABLE "Cuota" DROP CONSTRAINT "Cuota_pkey",
DROP COLUMN "created_at",
DROP COLUMN "estado",
DROP COLUMN "fecha_pago",
DROP COLUMN "fecha_vencimiento",
DROP COLUMN "id",
DROP COLUMN "metodo_pago",
DROP COLUMN "socio_id",
ADD COLUMN     "deportista_id" INTEGER NOT NULL,
ADD COLUMN     "estadoCuota" VARCHAR(50) NOT NULL,
ADD COLUMN     "fechaEmision" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaVencimiento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id_cuota" SERIAL NOT NULL,
ADD COLUMN     "id_disciplina" INTEGER NOT NULL,
ADD COLUMN     "nroCuota" INTEGER NOT NULL,
DROP COLUMN "monto",
ADD COLUMN     "monto" MONEY NOT NULL,
DROP COLUMN "mes",
ADD COLUMN     "mes" VARCHAR(20),
ADD CONSTRAINT "Cuota_pkey" PRIMARY KEY ("id_cuota");

-- DropTable
DROP TABLE "public"."Actividad";

-- DropTable
DROP TABLE "public"."ActividadSocio";

-- DropTable
DROP TABLE "public"."Cancha";

-- DropTable
DROP TABLE "public"."Clase";

-- DropTable
DROP TABLE "public"."Comprobante";

-- DropTable
DROP TABLE "public"."Entrada";

-- DropTable
DROP TABLE "public"."Evento";

-- DropTable
DROP TABLE "public"."Profesor";

-- DropTable
DROP TABLE "public"."Reserva";

-- DropTable
DROP TABLE "public"."Socio";

-- DropTable
DROP TABLE "public"."Usuario";

-- DropTable
DROP TABLE "public"."cuotaXactividad";

-- DropEnum
DROP TYPE "public"."DiaSemana";

-- DropEnum
DROP TYPE "public"."EstadoReserva";

-- DropEnum
DROP TYPE "public"."FormaDePago";

-- DropEnum
DROP TYPE "public"."Mes";

-- DropEnum
DROP TYPE "public"."Sexo";

-- DropEnum
DROP TYPE "public"."estado_cuota";

-- DropEnum
DROP TYPE "public"."paisesLatam";

-- CreateTable
CREATE TABLE "Localidad" (
    "id_localidad" SERIAL NOT NULL,
    "codigoPostal" INTEGER NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "Localidad_pkey" PRIMARY KEY ("id_localidad")
);

-- CreateTable
CREATE TABLE "Domicilio" (
    "id_domicilio" SERIAL NOT NULL,
    "id_localidad" INTEGER NOT NULL,

    CONSTRAINT "Domicilio_pkey" PRIMARY KEY ("id_domicilio")
);

-- CreateTable
CREATE TABLE "CuentaUsuario" (
    "id_cuenta" SERIAL NOT NULL,
    "mail" VARCHAR(50) NOT NULL,
    "contrasena" VARCHAR(255) NOT NULL,

    CONSTRAINT "CuentaUsuario_pkey" PRIMARY KEY ("id_cuenta")
);

-- CreateTable
CREATE TABLE "Deportista" (
    "id_deportista" SERIAL NOT NULL,
    "estado" "EstadoDeportista" NOT NULL,
    "categoria" VARCHAR(50) NOT NULL,
    "fechaNac" TIMESTAMP(3) NOT NULL,
    "obraSocial" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,
    "dni" INTEGER NOT NULL,
    "sexo" VARCHAR(20),
    "fotoCarnet" VARCHAR(255),
    "id_disciplina" INTEGER NOT NULL,
    "id_cuenta" INTEGER NOT NULL,
    "id_domicilio" INTEGER,

    CONSTRAINT "Deportista_pkey" PRIMARY KEY ("id_deportista")
);

-- CreateTable
CREATE TABLE "Enfermedad" (
    "id_enfermedad" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "Enfermedad_pkey" PRIMARY KEY ("id_enfermedad")
);

-- CreateTable
CREATE TABLE "Telefono" (
    "id_telefono" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "id_deportista" INTEGER NOT NULL,

    CONSTRAINT "Telefono_pkey" PRIMARY KEY ("id_telefono")
);

-- CreateTable
CREATE TABLE "Disciplina" (
    "id_disciplina" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "precioMensual" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("id_disciplina")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id_pago" SERIAL NOT NULL,
    "fechaPago" TIMESTAMP(3) NOT NULL,
    "estadoPago" VARCHAR(50) NOT NULL,
    "linkComprobante" VARCHAR(50),
    "id_cuota" INTEGER NOT NULL,
    "id_deportista" INTEGER NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "_DeportistaToEnfermedad" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DeportistaToEnfermedad_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "CuentaUsuario_mail_key" ON "CuentaUsuario"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "Deportista_dni_key" ON "Deportista"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Deportista_id_cuenta_key" ON "Deportista"("id_cuenta");

-- CreateIndex
CREATE INDEX "_DeportistaToEnfermedad_B_index" ON "_DeportistaToEnfermedad"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Administrativo_id_cuenta_key" ON "Administrativo"("id_cuenta");

-- AddForeignKey
ALTER TABLE "Domicilio" ADD CONSTRAINT "Domicilio_id_localidad_fkey" FOREIGN KEY ("id_localidad") REFERENCES "Localidad"("id_localidad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrativo" ADD CONSTRAINT "Administrativo_id_cuenta_fkey" FOREIGN KEY ("id_cuenta") REFERENCES "CuentaUsuario"("id_cuenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deportista" ADD CONSTRAINT "Deportista_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "Disciplina"("id_disciplina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deportista" ADD CONSTRAINT "Deportista_id_cuenta_fkey" FOREIGN KEY ("id_cuenta") REFERENCES "CuentaUsuario"("id_cuenta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deportista" ADD CONSTRAINT "Deportista_id_domicilio_fkey" FOREIGN KEY ("id_domicilio") REFERENCES "Domicilio"("id_domicilio") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Telefono" ADD CONSTRAINT "Telefono_id_deportista_fkey" FOREIGN KEY ("id_deportista") REFERENCES "Deportista"("id_deportista") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuota" ADD CONSTRAINT "Cuota_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "Disciplina"("id_disciplina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuota" ADD CONSTRAINT "Cuota_deportista_id_fkey" FOREIGN KEY ("deportista_id") REFERENCES "Deportista"("id_deportista") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_id_cuota_fkey" FOREIGN KEY ("id_cuota") REFERENCES "Cuota"("id_cuota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_id_deportista_fkey" FOREIGN KEY ("id_deportista") REFERENCES "Deportista"("id_deportista") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeportistaToEnfermedad" ADD CONSTRAINT "_DeportistaToEnfermedad_A_fkey" FOREIGN KEY ("A") REFERENCES "Deportista"("id_deportista") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeportistaToEnfermedad" ADD CONSTRAINT "_DeportistaToEnfermedad_B_fkey" FOREIGN KEY ("B") REFERENCES "Enfermedad"("id_enfermedad") ON DELETE CASCADE ON UPDATE CASCADE;
