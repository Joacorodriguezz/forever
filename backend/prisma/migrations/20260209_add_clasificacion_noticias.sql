-- Migration: Add classification tables, adult responsibles, news and update schema
-- Date: 2026-02-09
-- Description: Updates database schema to match frontend requirements

-- =============================================================================
-- 1. CREATE NEW TABLES FOR CLASSIFICATION
-- =============================================================================

-- Generos table
CREATE TABLE IF NOT EXISTS "generos" (
  "id_genero" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(50) NOT NULL UNIQUE
);

-- Categorias table
CREATE TABLE IF NOT EXISTS "categorias" (
  "id_categoria" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(50) NOT NULL UNIQUE
);

-- Subcategorias table
CREATE TABLE IF NOT EXISTS "subcategorias" (
  "id_subcategoria" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(100) NOT NULL,
  "id_disciplina" INTEGER NOT NULL REFERENCES "disciplinas"("id_disciplina") ON DELETE CASCADE,
  "id_categoria" INTEGER NOT NULL REFERENCES "categorias"("id_categoria") ON DELETE CASCADE,
  "id_genero" INTEGER REFERENCES "generos"("id_genero") ON DELETE CASCADE,
  UNIQUE("id_disciplina", "id_categoria", "id_genero", "nombre")
);

-- =============================================================================
-- 2. CREATE ADULTOS RESPONSABLES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS "adultos_responsables" (
  "id_adulto" SERIAL PRIMARY KEY,
  "id_deportista" INTEGER NOT NULL UNIQUE REFERENCES "deportistas"("id_deportista") ON DELETE CASCADE,
  "nombre" VARCHAR(100) NOT NULL,
  "apellido" VARCHAR(100) NOT NULL,
  "dni" VARCHAR(20) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "telefono" VARCHAR(50) NOT NULL
);

-- =============================================================================
-- 3. CREATE NOTICIAS TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS "noticias" (
  "id_noticia" SERIAL PRIMARY KEY,
  "titulo" VARCHAR(255) NOT NULL,
  "fecha" DATE NOT NULL,
  "resumen" TEXT NOT NULL,
  "contenido" TEXT NOT NULL,
  "id_autor" INTEGER REFERENCES "administrativos"("id_administrativo") ON DELETE SET NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "noticia_imagenes" (
  "id_imagen" SERIAL PRIMARY KEY,
  "id_noticia" INTEGER NOT NULL REFERENCES "noticias"("id_noticia") ON DELETE CASCADE,
  "url" TEXT NOT NULL,
  "orden" INTEGER NOT NULL DEFAULT 0
);

-- =============================================================================
-- 4. ALTER DEPORTISTAS TABLE
-- =============================================================================

-- Add new classification columns
ALTER TABLE "deportistas" 
  ADD COLUMN IF NOT EXISTS "id_genero" INTEGER REFERENCES "generos"("id_genero"),
  ADD COLUMN IF NOT EXISTS "id_categoria" INTEGER REFERENCES "categorias"("id_categoria"),
  ADD COLUMN IF NOT EXISTS "id_subcategoria" INTEGER REFERENCES "subcategorias"("id_subcategoria");

-- =============================================================================
-- 5. ALTER GRUPOS_FAMILIARES TABLE
-- =============================================================================

-- Add titular_dni and cuota_hermano columns
ALTER TABLE "grupos_familiares"
  ADD COLUMN IF NOT EXISTS "titular_dni" VARCHAR(20),
  ADD COLUMN IF NOT EXISTS "cuota_hermano" DECIMAL(10,2);

-- =============================================================================
-- 6. CREATE INDEXES
-- =============================================================================

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS "idx_deportistas_genero" ON "deportistas"("id_genero");
CREATE INDEX IF NOT EXISTS "idx_deportistas_categoria" ON "deportistas"("id_categoria");
CREATE INDEX IF NOT EXISTS "idx_deportistas_subcategoria" ON "deportistas"("id_subcategoria");
CREATE INDEX IF NOT EXISTS "idx_deportistas_estado" ON "deportistas"("estado");
CREATE INDEX IF NOT EXISTS "idx_cuotas_estado" ON "cuotas"("estado_cuota");
CREATE INDEX IF NOT EXISTS "idx_cuotas_vencimiento" ON "cuotas"("fecha_vencimiento");
CREATE INDEX IF NOT EXISTS "idx_noticias_fecha" ON "noticias"("fecha" DESC);
CREATE INDEX IF NOT EXISTS "idx_grupos_titular" ON "grupos_familiares"("titular_dni");

-- =============================================================================
-- 7. INSERT SEED DATA FOR CLASSIFICATION
-- =============================================================================

-- Insert Generos
INSERT INTO "generos" ("nombre") VALUES ('Masculino'), ('Femenino')
ON CONFLICT ("nombre") DO NOTHING;

-- Insert Categorias
INSERT INTO "categorias" ("nombre") VALUES ('Mayores'), ('Juveniles'), ('Infantiles')
ON CONFLICT ("nombre") DO NOTHING;

-- Insert Subcategorias for Futbol
-- Get IDs first (will be used in subcategorias inserts)
DO $$
DECLARE
  futbol_id INTEGER;
  hockey_id INTEGER;
  masculino_id INTEGER;
  femenino_id INTEGER;
  mayores_id INTEGER;
  juveniles_id INTEGER;
  infantiles_id INTEGER;
BEGIN
  -- Get discipline IDs
  SELECT "id_disciplina" INTO futbol_id FROM "disciplinas" WHERE "nombre" = 'Futbol';
  SELECT "id_disciplina" INTO hockey_id FROM "disciplinas" WHERE "nombre" = 'Hockey';
  
  -- Get gender IDs
  SELECT "id_genero" INTO masculino_id FROM "generos" WHERE "nombre" = 'Masculino';
  SELECT "id_genero" INTO femenino_id FROM "generos" WHERE "nombre" = 'Femenino';
  
  -- Get category IDs
  SELECT "id_categoria" INTO mayores_id FROM "categorias" WHERE "nombre" = 'Mayores';
  SELECT "id_categoria" INTO juveniles_id FROM "categorias" WHERE "nombre" = 'Juveniles';
  SELECT "id_categoria" INTO infantiles_id FROM "categorias" WHERE "nombre" = 'Infantiles';

  -- Futbol Mayores Masculino
  IF futbol_id IS NOT NULL AND masculino_id IS NOT NULL AND mayores_id IS NOT NULL THEN
    INSERT INTO "subcategorias" ("nombre", "id_disciplina", "id_categoria", "id_genero") VALUES
      ('Cuarta', futbol_id, mayores_id, masculino_id),
      ('Reserva', futbol_id, mayores_id, masculino_id),
      ('Senior', futbol_id, mayores_id, masculino_id),
      ('Primera', futbol_id, mayores_id, masculino_id)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Futbol Mayores Femenino
  IF futbol_id IS NOT NULL AND femenino_id IS NOT NULL AND mayores_id IS NOT NULL THEN
    INSERT INTO "subcategorias" ("nombre", "id_disciplina", "id_categoria", "id_genero") VALUES
      ('Cuarta', futbol_id, mayores_id, femenino_id),
      ('Tercera', futbol_id, mayores_id, femenino_id),
      ('+35', futbol_id, mayores_id, femenino_id),
      ('Primera', futbol_id, mayores_id, femenino_id)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Futbol Juveniles Masculino
  IF futbol_id IS NOT NULL AND masculino_id IS NOT NULL AND juveniles_id IS NOT NULL THEN
    INSERT INTO "subcategorias" ("nombre", "id_disciplina", "id_categoria", "id_genero") VALUES
      ('Pre-novena', futbol_id, juveniles_id, masculino_id),
      ('Novena', futbol_id, juveniles_id, masculino_id),
      ('Octava', futbol_id, juveniles_id, masculino_id),
      ('Séptima', futbol_id, juveniles_id, masculino_id),
      ('Sexta', futbol_id, juveniles_id, masculino_id),
      ('Quinta', futbol_id, juveniles_id, masculino_id)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Futbol Infantiles Masculino
  IF futbol_id IS NOT NULL AND masculino_id IS NOT NULL AND infantiles_id IS NOT NULL THEN
    INSERT INTO "subcategorias" ("nombre", "id_disciplina", "id_categoria", "id_genero") VALUES
      ('6 años', futbol_id, infantiles_id, masculino_id),
      ('7 años', futbol_id, infantiles_id, masculino_id),
      ('8 años', futbol_id, infantiles_id, masculino_id),
      ('9 años', futbol_id, infantiles_id, masculino_id),
      ('10 años', futbol_id, infantiles_id, masculino_id),
      ('11 años', futbol_id, infantiles_id, masculino_id)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Futbol Juveniles Femenino
  IF futbol_id IS NOT NULL AND femenino_id IS NOT NULL AND juveniles_id IS NOT NULL THEN
    INSERT INTO "subcategorias" ("nombre", "id_disciplina", "id_categoria", "id_genero") VALUES
      ('Sub 10', futbol_id, juveniles_id, femenino_id),
      ('Sub 11', futbol_id, juveniles_id, femenino_id),
      ('Sub 12', futbol_id, juveniles_id, femenino_id),
      ('Sub 13', futbol_id, juveniles_id, femenino_id),
      ('Sub 14', futbol_id, juveniles_id, femenino_id)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Futbol Infantiles Femenino
  IF futbol_id IS NOT NULL AND femenino_id IS NOT NULL AND infantiles_id IS NOT NULL THEN
    INSERT INTO "subcategorias" ("nombre", "id_disciplina", "id_categoria", "id_genero") VALUES
      ('Sub 10', futbol_id, infantiles_id, femenino_id),
      ('Sub 11', futbol_id, infantiles_id, femenino_id),
      ('Sub 12', futbol_id, infantiles_id, femenino_id),
      ('Sub 13', futbol_id, infantiles_id, femenino_id),
      ('Sub 14', futbol_id, infantiles_id, femenino_id)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Hockey Mayores (sin especificar género para que aplique a ambos)
  IF hockey_id IS NOT NULL AND mayores_id IS NOT NULL THEN
    INSERT INTO "subcategorias" ("nombre", "id_disciplina", "id_categoria", "id_genero") VALUES
      ('Intermedia', hockey_id, mayores_id, NULL),
      ('Primera', hockey_id, mayores_id, NULL)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Hockey Juveniles
  IF hockey_id IS NOT NULL AND juveniles_id IS NOT NULL THEN
    INSERT INTO "subcategorias" ("nombre", "id_disciplina", "id_categoria", "id_genero") VALUES
      ('Sub 14', hockey_id, juveniles_id, NULL),
      ('Sub 17', hockey_id, juveniles_id, NULL)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Hockey Infantiles
  IF hockey_id IS NOT NULL AND infantiles_id IS NOT NULL THEN
    INSERT INTO "subcategorias" ("nombre", "id_disciplina", "id_categoria", "id_genero") VALUES
      ('10ma', hockey_id, infantiles_id, NULL),
      ('9na', hockey_id, infantiles_id, NULL),
      ('8va', hockey_id, infantiles_id, NULL)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;

-- =============================================================================
-- 8. UPDATE EXISTING DATA (MIGRATION)
-- =============================================================================

-- IMPORTANT: After running this migration, you need to manually update existing deportistas
-- to assign them proper id_genero, id_categoria, id_subcategoria based on the old 'categoria' field
-- This can be done with additional UPDATE statements or through the application

-- Example for updating existing deportistas (adjust as needed):
-- UPDATE "deportistas" SET 
--   "id_genero" = (SELECT "id_genero" FROM "generos" WHERE "nombre" = 'Masculino'),
--   "id_categoria" = (SELECT "id_categoria" FROM "categorias" WHERE "nombre" = 'Mayores')
-- WHERE ... (add your conditions)

-- =============================================================================
-- 9. CREATE TRIGGER FOR UPDATED_AT
-- =============================================================================

-- Trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to noticias
CREATE TRIGGER update_noticias_updated_at BEFORE UPDATE ON "noticias"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- NOTES FOR MANUAL STEPS AFTER MIGRATION:
-- =============================================================================

-- 1. Update existing deportistas to assign id_genero, id_categoria, id_subcategoria
-- 2. Once all deportistas are migrated, you can make these columns NOT NULL:
--    ALTER TABLE "deportistas" ALTER COLUMN "id_genero" SET NOT NULL;
--    ALTER TABLE "deportistas" ALTER COLUMN "id_categoria" SET NOT NULL;
-- 3. After migration is complete, you can optionally drop the old 'categoria' column:
--    ALTER TABLE "deportistas" DROP COLUMN IF EXISTS "categoria";
-- 4. Update grupos_familiares with titular_dni from the deportista marked as es_principal

-- Migration completed successfully
