-- Remove Localidad and Domicilio: drop FK and column from deportistas, then drop tables.

ALTER TABLE "deportistas" DROP CONSTRAINT IF EXISTS "deportistas_id_domicilio_fkey";
ALTER TABLE "deportistas" DROP COLUMN IF EXISTS "id_domicilio";

DROP TABLE IF EXISTS "domicilios";
DROP TABLE IF EXISTS "localidades";
