-- Asegura columnas de grupos familiares alineadas con schema.prisma
-- Ejecutar en Supabase SQL Editor si el seed falla con "column existe does not exist"

ALTER TABLE "grupo_familiar_integrantes"
  ADD COLUMN IF NOT EXISTS "es_principal" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "grupos_familiares"
  ADD COLUMN IF NOT EXISTS "titular_dni" VARCHAR(20),
  ADD COLUMN IF NOT EXISTS "cuota_hermano" DECIMAL(10,2);

-- Verificar columnas actuales
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'grupo_familiar_integrantes'
ORDER BY ordinal_position;
