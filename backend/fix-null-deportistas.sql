-- Arreglar datos NULL en deportistas
-- Este script asigna valores por defecto a los campos obligatorios que están NULL

-- 1. Asignar genero por defecto (ID 1 = Masculino) a deportistas con generoId NULL
UPDATE "deportistas"
SET "id_genero" = 1
WHERE "id_genero" IS NULL;

-- 2. Asignar categoría por defecto (ID 1 = primera categoría) a deportistas con categoriaId NULL
UPDATE "deportistas"
SET "id_categoria" = 1
WHERE "id_categoria" IS NULL;

-- 3. Asignar disciplina por defecto (ID 1 = Futbol) a deportistas con disciplinaId NULL
UPDATE "deportistas"
SET "id_disciplina" = 1
WHERE "id_disciplina" IS NULL;

-- 4. Verificar que no haya más NULLs en campos obligatorios
SELECT 
    COUNT(*) as total_deportistas,
    SUM(CASE WHEN "id_genero" IS NULL THEN 1 ELSE 0 END) as genero_null,
    SUM(CASE WHEN "id_categoria" IS NULL THEN 1 ELSE 0 END) as categoria_null,
    SUM(CASE WHEN "id_disciplina" IS NULL THEN 1 ELSE 0 END) as disciplina_null
FROM "deportistas";

-- 5. Mostrar deportistas actualizados
SELECT 
    "id_deportista",
    "nombre",
    "apellido",
    "dni",
    "id_genero",
    "id_categoria",
    "id_disciplina"
FROM "deportistas"
ORDER BY "created_at" DESC;
