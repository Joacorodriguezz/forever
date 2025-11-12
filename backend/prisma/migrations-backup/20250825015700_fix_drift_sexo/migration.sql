-- Register existing enum "Sexo" without duplicating
DO $$ BEGIN
  CREATE TYPE "Sexo" AS ENUM ('M', 'F');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Alter column "sexo" type without dropping
ALTER TABLE "Socio" ALTER COLUMN "sexo" TYPE "Sexo" USING ("sexo"::text)::"Sexo";