# Instrucciones para actualizar la base de datos en Supabase

## 1. Backup de la base de datos actual (IMPORTANTE)

Antes de ejecutar las migraciones, haz un backup en Supabase:
- Ve a tu proyecto en Supabase
- Database > Backups > Create Backup

## 2. Ejecutar las migraciones

### Opción A: Desde Supabase SQL Editor (RECOMENDADO)

1. Ve a tu proyecto en Supabase
2. Click en "SQL Editor" en el menú izquierdo
3. Copia y pega el contenido de `20260209_add_clasificacion_noticias.sql`
4. Click en "Run" para ejecutar
5. Verifica que no haya errores
6. Luego copia y pega el contenido de `20260209_seed_data.sql`
7. Click en "Run" para ejecutar los datos de prueba

### Opción B: Usando Prisma Migrate (si tienes acceso local a la BD)

```bash
cd backend
npx prisma migrate dev --name add_clasificacion_noticias
npx prisma generate
```

## 3. Verificar la migración

Ejecuta estas queries en Supabase SQL Editor para verificar:

```sql
-- Verificar que las nuevas tablas existan
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('generos', 'categorias', 'subcategorias', 'adultos_responsables', 'noticias', 'noticia_imagenes');

-- Verificar que los géneros se hayan insertado
SELECT * FROM generos;

-- Verificar que las categorías se hayan insertado
SELECT * FROM categorias;

-- Verificar que las subcategorías se hayan insertado (debe haber varias)
SELECT COUNT(*) FROM subcategorias;

-- Verificar que las disciplinas se insertaron con timestamps
SELECT * FROM disciplinas;

-- Verificar que se creó el admin con timestamps
SELECT email, rol, created_at, updated_at FROM cuentas_usuario WHERE rol = 'Admin';

-- Verificar deportistas de prueba
SELECT nombre, apellido, dni FROM deportistas;

-- Verificar que las columnas nuevas existan en deportistas
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'deportistas' 
AND column_name IN ('id_genero', 'id_categoria', 'id_subcategoria');

-- Verificar que las columnas nuevas existan en grupos_familiares
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'grupos_familiares' 
AND column_name IN ('titular_dni', 'cuota_hermano');
```

## 4. Cambios principales realizados

### Nuevas tablas:
- ✅ `generos` - Masculino, Femenino
- ✅ `categorias` - Mayores, Juveniles, Infantiles
- ✅ `subcategorias` - Octava, Primera, Sub 14, etc. (con relaciones a disciplina/categoría/género)
- ✅ `adultos_responsables` - Datos del adulto responsable para Juveniles/Infantiles
- ✅ `noticias` - Publicaciones del club
- ✅ `noticia_imagenes` - Imágenes asociadas a noticias

### Columnas agregadas:
- ✅ `deportistas.id_genero` (FK a generos)
- ✅ `deportistas.id_categoria` (FK a categorias)
- ✅ `deportistas.id_subcategoria` (FK a subcategorias)
- ✅ `grupos_familiares.titular_dni` (DNI del titular que paga)
- ✅ `grupos_familiares.cuota_hermano` (Monto descuento familiar)

### Índices creados para mejor rendimiento:
- ✅ Índices en clasificación deportiva (género, categoría, subcategoría)
- ✅ Índices en estado y vencimiento de cuotas
- ✅ Índice en fecha de noticias
- ✅ Índice en titular de grupos familiares

## 5. Datos de prueba incluidos

El seed incluye:
- 2 disciplinas: Fútbol ($10,000) y Hockey ($12,000)
- 2 géneros: Masculino, Femenino
- 3 categorías: Mayores, Juveniles, Infantiles
- ~30 subcategorías (todas las combinaciones de Fútbol/Hockey)
- 1 cuenta admin: `admin@foreverclub.com` / `admin123`
- 2 deportistas de prueba: Juan Pérez (Juveniles) y María García (Mayores)
- 1 grupo familiar con Juan como titular
- 4 cuotas de prueba (2 por deportista)
- 1 noticia de ejemplo

## 6. IMPORTANTE: Migrar deportistas existentes

Si tenías deportistas en la BD antes de esta migración, debes asignarles valores a las nuevas columnas:

```sql
-- Ejemplo: Asignar género Masculino a todos los deportistas que no tienen género
UPDATE deportistas 
SET id_genero = (SELECT id_genero FROM generos WHERE nombre = 'Masculino')
WHERE id_genero IS NULL;

-- Ejemplo: Asignar categoría Mayores a todos los deportistas que no tienen categoría
UPDATE deportistas 
SET id_categoria = (SELECT id_categoria FROM categorias WHERE nombre = 'Mayores')
WHERE id_categoria IS NULL;
```

Después de migrar todos los deportistas, puedes hacer las columnas NOT NULL:

```sql
ALTER TABLE deportistas ALTER COLUMN id_genero SET NOT NULL;
ALTER TABLE deportistas ALTER COLUMN id_categoria SET NOT NULL;
```

## 7. Actualizar variables de entorno

Asegúrate de que tu `backend/.env` tenga:

```env
DATABASE_URL="postgresql://postgres:[TU_PASSWORD]@db.[TU_PROYECTO].supabase.co:5432/postgres"
JWT_SECRET="[GENERAR_UN_SECRET_SEGURO_32_CARACTERES_MINIMO]"
FRONTEND_URL="http://localhost:5173,https://tu-dominio-frontend.com"
```

## 8. Regenerar Prisma Client

Después de la migración, regenera el cliente de Prisma:

```bash
cd backend
npx prisma generate
```

## 9. Probar la conexión

```bash
cd backend
npm run dev
```

Deberías ver: "✓ Conectado a la base de datos correctamente"

## 10. Credenciales de prueba

Después del seed, puedes hacer login con:

**Admin:**
- Email: `admin@foreverclub.com`
- Contraseña: `admin123`

**Deportista (Juan Pérez):**
- Email: `juan.perez@email.com`
- Contraseña: `deportista123`

**Deportista (María García):**
- Email: `maria.garcia@email.com`
- Contraseña: `deportista123`

---

## Troubleshooting

### Error: "relation already exists"
- Algunas tablas ya existían. No es problema, el `IF NOT EXISTS` lo maneja.

### Error: "column already exists"
- Algunas columnas ya existían. El `ADD COLUMN IF NOT EXISTS` lo maneja.

### Error de claves foráneas
- Verifica que las tablas padre existan antes (disciplinas, generos, categorias).
- El script está ordenado para crear en el orden correcto.

### Subcategorías no se insertan
- Verifica que existan disciplinas "Futbol" y "Hockey" en la tabla `disciplinas`.
- El seed usa esos nombres exactos (con mayúscula inicial).
