# Backend Actualizado - Resumen de Cambios

## ✅ Cambios Completados

### 1. **Tipos y DTOs Actualizados** (`src/types/requests.ts`)

#### Deportista DTOs
- ✅ Reemplazado `categoria: string` por campos normalizados:
  - `generoId: number`
  - `categoriaId: number`
  - `subcategoriaId?: number`
- ✅ Agregado `CreateAdultoResponsableDTO` con campos: nombre, apellido, dni, email, telefono
- ✅ Agregado `adultoResponsable?: CreateAdultoResponsableDTO` en `CreateDeportistaDTO` y `UpdateDeportistaDTO`

#### Grupo Familiar DTOs
- ✅ Agregado `titularDni: string` en `CreateGrupoFamiliarDTO` y `UpdateGrupoFamiliarDTO`
- ✅ Agregado `cuotaHermano?: number` en ambos DTOs

#### Nuevos DTOs
- ✅ `CreateNoticiaDTO`: titulo, fecha, resumen, contenido, autorId, imagenes[]
- ✅ `UpdateNoticiaDTO`: campos opcionales de noticia
- ✅ `ResetPasswordDTO`: newPassword

---

### 2. **DeportistaService Actualizado** (`src/services/deportista.service.ts`)

#### Método `create()`
- ✅ Crea deportista con campos de clasificación normalizada (`generoId`, `categoriaId`, `subcategoriaId`)
- ✅ Crea `AdultoResponsable` automáticamente si se proporciona en el DTO (para menores)
- ✅ Transacción completa: cuenta → domicilio → deportista → adulto responsable

#### Método `getById()` y `getAll()`
- ✅ Incluye relaciones: `genero`, `categoria`, `subcategoria`, `adultoResponsable`

#### Método `update()`
- ✅ Actualiza clasificación normalizada
- ✅ Actualiza o crea `AdultoResponsable` si se proporciona

#### Nuevo Método `resetPassword()`
- ✅ Permite restablecer la contraseña de un deportista por su ID
- ✅ Hashea la nueva contraseña con bcrypt

---

### 3. **AuthService Actualizado** (`src/services/auth.service.ts`)

#### Método `login()`
- ✅ Soporta login por **email O DNI**
- ✅ Lógica de búsqueda en cascada:
  1. Buscar por email en `cuentas_usuario`
  2. Si no existe, buscar por DNI en `deportistas`
  3. Si tampoco, buscar por DNI en `administrativos`
- ✅ Compatible con el frontend que envía DNI en el campo "email"

---

### 4. **Nuevo: ClasificacionService** (`src/services/clasificacion.service.ts`)

#### Métodos disponibles
- ✅ `getGeneros()`: obtiene todos los géneros
- ✅ `getCategorias()`: obtiene todas las categorías
- ✅ `getSubcategorias(disciplinaId?, categoriaId?, generoId?)`: filtradas por disciplina/categoría/género
- ✅ `getOpcionesCompletas()`: devuelve toda la estructura de opciones para el frontend
  - Géneros, categorías, disciplinas
  - Subcategorías agrupadas por clave (`disciplina|categoria|genero`)
  - Reglas de excepción (ej: Hockey Masculino solo Mayores)

#### Rutas creadas (`src/routes/clasificacion.routes.ts`)
- ✅ `GET /api/clasificacion/generos`
- ✅ `GET /api/clasificacion/categorias`
- ✅ `GET /api/clasificacion/subcategorias?disciplinaId=&categoriaId=&generoId=`
- ✅ `GET /api/clasificacion/opciones` (para frontend)

---

### 5. **Nuevo: NoticiaService** (`src/services/noticia.service.ts`)

#### Métodos CRUD
- ✅ `create(data)`: crea noticia con múltiples imágenes ordenadas
- ✅ `getAll()`: lista todas las noticias con autor e imágenes
- ✅ `getById(id)`: obtiene noticia específica
- ✅ `update(id, data)`: actualiza noticia y reemplaza imágenes
- ✅ `delete(id)`: elimina noticia (cascade a imágenes)

#### Rutas creadas (`src/routes/noticia.routes.ts`)
- ✅ `GET /api/noticias` (público)
- ✅ `GET /api/noticias/:id` (público)
- ✅ `POST /api/noticias` (solo Admin/Administrativo)
- ✅ `PUT /api/noticias/:id` (solo Admin/Administrativo)
- ✅ `DELETE /api/noticias/:id` (solo Admin/Administrativo)

---

### 6. **GrupoFamiliarService Actualizado** (`src/services/grupoFamiliar.service.ts`)

#### Método `create()`
- ✅ Ahora incluye `titularDni` y `cuotaHermano` al crear el grupo

#### Método `update()`
- ✅ Permite actualizar `titularDni` y `cuotaHermano`

---

### 7. **Password Reset Endpoints**

#### Deportistas
- ✅ Ruta: `PUT /api/deportistas/:id/reset-password` (solo Admin/Administrativo)
- ✅ Body: `{ "newPassword": "..." }`
- ✅ Implementado en `deportistaController.resetPassword()`

#### Administrativos
- ✅ Ruta: `PUT /api/users/admin/:id/reset-password` (solo Admin)
- ✅ Body: `{ "newPassword": "..." }`
- ✅ Implementado en `userService.resetAdminPassword()` y `userController.resetAdminPassword()`

---

### 8. **Validators Actualizados**

#### `deportista.validator.ts`
- ✅ `createDeportistaSchema`: ahora requiere `generoId`, `categoriaId`, `subcategoriaId?`
- ✅ Agregado `adultoResponsableSchema` con validaciones completas
- ✅ `adultoResponsable` es opcional en create y update

#### `grupoFamiliar.validator.ts`
- ✅ `createGrupoFamiliarSchema`: ahora requiere `titularDni` (DNI 7-8 dígitos)
- ✅ Agregado `cuotaHermano?: number` (no negativo)
- ✅ Actualizado `updateGrupoFamiliarSchema` con los mismos campos opcionales

---

### 9. **Rutas Registradas** (`src/routes/index.ts`)

Se agregaron las nuevas rutas al router principal:
```typescript
router.use('/clasificacion', clasificacionRoutes);
router.use('/noticias', noticiaRoutes);
```

---

## 📋 Estructura Final de la API

### Autenticación
- `POST /api/auth/login` - Login por email o DNI ✅

### Deportistas
- `POST /api/deportistas` - Crear (con clasificación normalizada + adulto responsable) ✅
- `GET /api/deportistas` - Listar ✅
- `GET /api/deportistas/:id` - Obtener ✅
- `PUT /api/deportistas/:id` - Actualizar ✅
- `PUT /api/deportistas/:id/reset-password` - Restablecer contraseña ✅
- `DELETE /api/deportistas/:id` - Eliminar ✅

### Clasificación (Nuevo)
- `GET /api/clasificacion/generos` ✅
- `GET /api/clasificacion/categorias` ✅
- `GET /api/clasificacion/subcategorias` ✅
- `GET /api/clasificacion/opciones` ✅

### Noticias (Nuevo)
- `GET /api/noticias` ✅
- `GET /api/noticias/:id` ✅
- `POST /api/noticias` ✅
- `PUT /api/noticias/:id` ✅
- `DELETE /api/noticias/:id` ✅

### Grupos Familiares
- `POST /api/grupos-familiares` - Crear (con titularDni y cuotaHermano) ✅
- `GET /api/grupos-familiares` - Listar ✅
- `GET /api/grupos-familiares/:id` - Obtener ✅
- `PUT /api/grupos-familiares/:id` - Actualizar ✅
- `DELETE /api/grupos-familiares/:id` - Eliminar ✅

### Usuarios/Admin
- `PUT /api/users/admin/:id/reset-password` - Restablecer contraseña admin ✅

---

## 🔄 Próximos Pasos

### 1. **Aplicar Migraciones en Supabase**
Ejecuta en el SQL Editor de Supabase (en orden):
1. `backend/prisma/migrations/20260209_add_clasificacion_noticias.sql`
2. `backend/prisma/migrations/20260209_seed_data.sql`

### 2. **Regenerar Prisma Client**
```bash
cd backend
npx prisma generate
```

### 3. **Verificar Variables de Entorno** (`.env`)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="tu-secret-seguro"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

### 4. **Instalar Dependencias (si es necesario)**
```bash
npm install
```

### 5. **Iniciar el Backend**
```bash
npm run dev
```

---

## ✨ Funcionalidades Implementadas

### ✅ Para el Frontend
1. **Login por DNI**: El frontend puede enviar DNI en lugar de email
2. **Clasificación Normalizada**: Género, Categoría, Subcategoría como entidades separadas
3. **Adulto Responsable**: Campo automático para menores (Infantiles/Juveniles)
4. **Titular del Grupo**: Campo `titularDni` para identificar quién paga
5. **Cuota Hermano**: Descuento por grupos familiares
6. **CRUD de Noticias**: Gestión completa de noticias con imágenes
7. **Reset de Contraseña**: Administradores pueden restablecer contraseñas de deportistas y admins

### ✅ Seguridad
- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT para autenticación
- ✅ Roles y permisos correctos en cada endpoint
- ✅ Validación con Zod en todos los DTOs

### ✅ Base de Datos
- ✅ Schema actualizado con todas las tablas necesarias
- ✅ Relaciones correctas entre entidades
- ✅ Constraints y validaciones a nivel de BD
- ✅ Triggers para `updated_at`
- ✅ Seed data completo para testing

---

## 🎯 Estado Actual

**✅ Backend completamente actualizado y alineado con la base de datos**

El backend ahora refleja exactamente la estructura de la base de datos que definiste:
- Clasificación normalizada (géneros, categorías, subcategorías)
- Adultos responsables para menores
- Titular del grupo familiar
- CRUD completo de noticias
- Login por DNI
- Reset de contraseñas por administración

**No hay linter errors** y toda la lógica está implementada siguiendo las mejores prácticas.

---

**Fecha de actualización**: 2026-02-09
