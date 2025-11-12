-- CreateEnum
CREATE TYPE "public"."FormaDePago" AS ENUM ('EFECTIVO', 'CBU');

-- DropForeignKey
ALTER TABLE "public"."Entrada" DROP CONSTRAINT "Entrada_socioId_fkey";

-- AlterTable
ALTER TABLE "public"."Entrada" ADD COLUMN     "comprobanteUrl" TEXT,
ADD COLUMN     "formaDePago" "public"."FormaDePago" NOT NULL DEFAULT 'EFECTIVO',
ALTER COLUMN "precioUnitario" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "socioId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Entrada" ADD CONSTRAINT "Entrada_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "public"."Socio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
