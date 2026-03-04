# Integración Frontend - Backend

## ✅ Configuración Completada

### 1. Variables de Entorno

Se creó el archivo `.env` en la raíz del frontend con:

```env
VITE_API_URL=http://localhost:5000/api
```

Si tu backend corre en otro puerto, modifica esta URL.

### 2. Dependencias Instaladas

- ✅ `axios` - Cliente HTTP para comunicación con la API

### 3. Servicios API Creados

Se crearon los siguientes servicios en `src/services/`:

- ✅ `auth.service.ts` - Login y autenticación
- ✅ `clasificacion.service.ts` - Géneros, categorías, subcategorías
- ✅ `deportista.service.ts` - CRUD de deportistas
- ✅ `noticia.service.ts` - CRUD de noticias
- ✅ `grupoFamiliar.service.ts` - CRUD de grupos familiares

### 4. Contextos Actualizados

- ✅ `AuthContext` - Ahora usa la API real para login y autenticación
- ✅ `OpcionesAdminContext` - Carga opciones de clasificación desde el backend
- ✅ `NoticiasContext` - Obtiene y crea noticias desde la API

### 5. Componentes Actualizados

- ✅ `LoginForm` - Login asíncrono con manejo de loading y errores

---

## 🚀 Cómo ejecutar

### 1. Iniciar el Backend

```bash
cd backend
npm run dev
```

El backend debería estar corriendo en `http://localhost:5000`

### 2. Iniciar el Frontend

```bash
cd frontend
npm run dev
```

El frontend debería estar corriendo en `http://localhost:5173`

---

## 🔑 Credenciales de Prueba

Después de ejecutar las migraciones SQL, puedes usar estas credenciales:

### Admin:
- **Email**: `admin@foreverclub.com`
- **Contraseña**: `admin123`

### Deportistas:
- **Email**: `juan.perez@email.com`
- **Contraseña**: `deportista123`

También puedes usar el **DNI** en lugar del email para deportistas.

---

## 📋 Funcionalidades Integradas

### ✅ Autenticación
- Login por email o DNI
- JWT almacenado en localStorage
- Auto-logout en token expirado
- Protección de rutas

### ✅ Clasificación
- Carga dinámica de géneros, categorías y subcategorías desde el backend
- Reglas de excepción aplicadas (ej: Hockey Masculino solo Mayores)

### ✅ Noticias
- Listado de noticias desde la API
- Creación de noticias (solo admins)

### ⏳ Pendiente de Integración

Los siguientes componentes aún usan datos mock y necesitan ser actualizados:

1. **Panel de Administración**:
   - `AdminDeportistas.tsx` - Gestión de deportistas
   - `AdminCuotas.tsx` - Gestión de cuotas
   - `AdminGruposFamiliares.tsx` - Gestión de grupos familiares
   - `AdminAdmins.tsx` - Gestión de administradores

2. **Panel de Usuario**:
   - `Dashboard.tsx` - Panel principal del deportista
   - `DebtStatus.tsx` - Estado de deuda
   - `GrupoFamiliar.tsx` - Ver grupo familiar
   - `ProfileEdit.tsx` - Editar perfil

---

## 🔧 Próximos Pasos

### Paso 1: Actualizar componentes del panel de admin

Para cada componente en `src/pages/admin/`, reemplazar el uso de datos mock por llamadas a la API:

**Ejemplo**: Para `AdminDeportistas.tsx`

```typescript
// Antes (mock)
import { MOCK_DEPORTISTAS } from '../data/admin';

// Después (API)
import { deportistaService } from '../services/deportista.service';

// Usar en el componente
useEffect(() => {
  const fetchDeportistas = async () => {
    const response = await deportistaService.getAll();
    if (response.success) {
      setDeportistas(response.data.data);
    }
  };
  fetchDeportistas();
}, []);
```

### Paso 2: Actualizar componentes del panel de usuario

Similar al paso anterior, pero para componentes en `src/pages/`.

### Paso 3: Implementar carga de loading states

Agregar indicadores de carga mientras se obtienen datos de la API.

### Paso 4: Manejo de errores

Implementar mensajes de error amigables cuando las llamadas a la API fallen.

---

## 🐛 Troubleshooting

### Error: "Network Error" o "CORS"
- Verifica que el backend esté corriendo
- Asegúrate de que el backend tenga configurado CORS para permitir `http://localhost:5173`

### Error: "401 Unauthorized"
- El token JWT expiró o es inválido
- Cierra sesión y vuelve a iniciar sesión

### No aparecen datos
- Verifica que las migraciones SQL se hayan ejecutado correctamente
- Revisa la consola del navegador para errores de API
- Verifica que el `VITE_API_URL` en `.env` sea correcto

### El login no funciona
- Verifica que uses las credenciales correctas del seed
- Revisa la consola del backend para errores
- Asegúrate de que la tabla `cuentas_usuario` tenga datos

---

## 📝 Notas Importantes

1. **Token JWT**: Se guarda en `localStorage` con la key `"token"`
2. **Usuario**: Se guarda en `localStorage` con la key `"forever_auth"`
3. **Interceptor**: Todas las requests a la API incluyen automáticamente el token JWT
4. **Auto-logout**: Si el token es inválido (401), se redirige automáticamente al login

---

**Fecha de integración**: 2026-02-09
