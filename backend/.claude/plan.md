# Plan de Implementación - Backend Sistema de Gestión Deportiva

## Stack Tecnológico (Según Documento PDF)

### Frontend
- **Framework:** React ⚛️
- **Justificación:** Interfaces modernas, dinámicas y responsive. Accesible desde cualquier dispositivo.

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 🌐
- **Lenguaje:** TypeScript
- **Justificación:** 
  - Manejo de múltiples conexiones simultáneas
  - Excelente integración con Mercado Pago
  - Arquitectura cliente-servidor web
  - Open source con gran comunidad

### Base de Datos
- **Motor:** PostgreSQL 🐘 (via Supabase)
- **ORM:** Prisma
- **Justificación:**
  - Potente, escalable y gratuito
  - Soporta relaciones complejas
  - Confiable para información crítica
  - Seguridad avanzada (roles, permisos, encriptación)
  - Excelente interoperabilidad con Node.js

### Servicios Externos
- **Pasarela de pagos:** Mercado Pago

### Librerías Adicionales
- **Validación:** Zod
- **Autenticación:** JWT (jsonwebtoken) + bcrypt
- **Seguridad:** helmet, cors
- **Reportes:** PDFKit/Puppeteer (PDF), ExcelJS (Excel)
- **Logging:** Winston o Pino (opcional)

---

## Fase 1: Configuración Inicial del Proyecto

### 1.1 Setup del Proyecto
- [ ] Inicializar proyecto Node.js con TypeScript
- [ ] Instalar dependencias principales:
  - express, @types/express
  - typescript, ts-node, @types/node
  - prisma, @prisma/client
  - dotenv
  - cors, @types/cors
  - helmet
  - zod
  - jsonwebtoken, @types/jsonwebtoken
  - bcryptjs, @types/bcryptjs
- [ ] Configurar `tsconfig.json`
- [ ] Configurar scripts de `package.json` (dev, build, start, prisma:migrate, etc.)
- [ ] Crear estructura de carpetas base

### 1.2 Estructura de Carpetas
```
src/
├── config/           # Configuraciones (database, env, etc.)
├── types/            # Tipos de TypeScript
│   ├── index.ts
│   ├── models.ts
│   └── requests.ts
├── middlewares/      # Middlewares personalizados
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validation.middleware.ts
├── controllers/      # Controladores por entidad
│   ├── auth.controller.ts
│   ├── deportista.controller.ts
│   ├── cuota.controller.ts
│   ├── pago.controller.ts
│   ├── administrativo.controller.ts
│   └── ...
├── services/         # Lógica de negocio
│   ├── auth.service.ts
│   ├── deportista.service.ts
│   ├── cuota.service.ts
│   ├── pago.service.ts
│   └── ...
├── routes/           # Definición de rutas
│   ├── index.ts
│   ├── auth.routes.ts
│   ├── deportista.routes.ts
│   ├── cuota.routes.ts
│   └── ...
├── validators/       # Esquemas de validación
│   ├── auth.validator.ts
│   ├── deportista.validator.ts
│   └── ...
├── utils/            # Utilidades
│   ├── response.ts
│   └── errors.ts
├── prisma/           # Prisma schema y migraciones
│   └── schema.prisma
├── app.ts            # Configuración de Express
└── server.ts         # Punto de entrada
```

### 1.3 Configuración de Variables de Entorno
- [ ] Crear archivo `.env.example`
- [ ] Configurar variables:
  - DATABASE_URL
  - PORT
  - JWT_SECRET
  - JWT_EXPIRES_IN
  - NODE_ENV

---

## Fase 2: Configuración de Prisma y Base de Datos

### 2.1 Schema de Prisma
- [ ] Inicializar Prisma: `npx prisma init`
- [ ] Definir modelos según el diagrama:

#### Modelos a crear (en orden de dependencias):

1. **Localidad**
   - id_localidad (PK, autoincrement)
   - codigoPostal
   - nombre

2. **Domicilio**
   - id_domicilio (PK, autoincrement)
   - id_localidad (FK → Localidad)

3. **Enfermedad**
   - id_enfermedad (PK, autoincrement)
   - nombre

4. **Telefono**
   - id_telefono (PK, autoincrement)
   - numero

5. **Disciplina**
   - id_disciplina (PK, autoincrement)
   - nombre
   - precioMensual

6. **CuentaUsuario**
   - id_cuenta (PK, autoincrement)
   - mail (unique)
   - contraseña (hashed)
   - createdAt
   - updatedAt

7. **Administrativo**
   - id_administrativo (PK, autoincrement)
   - nombre
   - apellido
   - dni (unique)

8. **Deportista**
   - id_deportista (PK, autoincrement)
   - estado (enum: 'En deuda', 'Al día', 'Morosa', 'Inactiva')
   - categoria
   - fechaNac
   - obraSocial
   - id_disciplina (FK → Disciplina)
   - id_cuenta (FK → CuentaUsuario)
   - id_domicilio (FK → Domicilio)
   - nombre
   - apellido
   - dni (unique)
   - Relaciones many-to-many con Enfermedad y Telefono

9. **Pago**
   - id_pago (PK, autoincrement)
   - fechaPago
   - estadoPago
   - linkComprobante
   - id_cuota (FK → Cuota)
   - id_deportista (FK → Deportista)

10. **Cuota**
    - id_cuota (PK, autoincrement)
    - id_disciplina (FK → Disciplina)
    - id_pago (FK → Pago, nullable)
    - monto
    - fechaVencimiento
    - estadoCuota
    - nroCuota
    - fechaEmision

### 2.2 Migraciones
- [ ] Crear migración inicial: `npx prisma migrate dev --name init`
- [ ] Generar Prisma Client: `npx prisma generate`
- [ ] Verificar conexión con Supabase

---

## Fase 3: Tipos de TypeScript

### 3.1 Tipos Base (types/models.ts)
- [ ] Crear interfaces para cada entidad del modelo
- [ ] Crear tipos de enums (EstadoDeportista, EstadoCuota, EstadoPago, etc.)
- [ ] Crear tipos de relaciones

### 3.2 Tipos de Request/Response (types/requests.ts)
- [ ] DTOs para crear/actualizar entidades
- [ ] Tipos de respuesta API
- [ ] Tipos de filtros y paginación

**Ejemplo de tipos a crear:**
```typescript
// Enums
export enum EstadoCuota {
  PAGADA = 'Pagada',
  PENDIENTE = 'Pendiente',
  VENCIDA = 'Vencida'
}

export enum EstadoPago {
  APROBADO = 'Aprobado',
  RECHAZADO = 'Rechazado'
}

export enum EstadoDeportista {
  EN_DEUDA = 'En deuda',
  AL_DIA = 'Al día',
  MOROSA = 'Morosa',
  INACTIVA = 'Inactiva'
}

// DTOs
export interface CreateDeportistaDTO {
  nombre: string;
  apellido: string;
  dni: string;
  fechaNac: Date;
  categoria: string;
  obraSocial?: string;
  id_disciplina: number;
  domicilio: CreateDomicilioDTO;
  cuenta: CreateCuentaDTO;
  telefonos?: string[];
  enfermedades?: number[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

---

## Fase 4: Utilidades y Helpers

### 4.1 Response Handlers (utils/response.ts)
- [ ] Función para respuestas exitosas
- [ ] Función para respuestas de error
- [ ] Función para paginación

### 4.2 Error Handlers (utils/errors.ts)
- [ ] Clase de error personalizada
- [ ] Códigos de error estándar
- [ ] Mensajes de error en español

---

## Fase 5: Middlewares

### 5.1 Auth Middleware (middlewares/auth.middleware.ts)
- [ ] **Verificación de JWT**
  - Extraer token del header Authorization
  - Validar firma y expiración del token
  - Extraer usuario del payload
- [ ] **Middleware de autorización por roles**
  - requireAdmin: solo usuarios con rol Admin
  - requireAdministrativo: Admin o Administrativo
  - requireDeportista: solo Deportistas (para rutas propias)
- [ ] **Validar estado del usuario**
  - Usuario debe estar activo (no bloqueado/inactivo) - según CU01

### 5.2 Error Middleware (middlewares/error.middleware.ts)
- [ ] **Handler global de errores**
  - Formatear errores según estructura estándar
  - Diferenciar errores de validación, autenticación, autorización
  - Mensajes en español según casos de uso del PDF
- [ ] **Formateo de errores de Prisma**
  - Unique constraint violations
  - Foreign key violations
  - Not found errors
- [ ] **Logger de errores**
  - Registrar en consola/archivo
  - Incluir stack trace en desarrollo

### 5.3 Validation Middleware (middlewares/validation.middleware.ts)
- [ ] **Middleware genérico para validación con Zod**
  - Validar body, params, query según schema
  - Retornar errores formateados
  - Mensajes específicos según casos de uso:
    - "Formato de email incorrecto" (CU01)
    - "La contraseña debe tener al menos 8 caracteres" (CU01)
    - "El usuario ya existe en el sistema" (CU02)
    - "Debe tener mínimo 8 caracteres y al menos una mayúscula" (CU02)
    - "Complete todos los campos obligatorios" (CU02)
- [ ] **Handler de errores de validación**
  - Extraer y formatear mensajes de Zod

### 5.4 Rate Limiting Middleware (middlewares/rate-limit.middleware.ts)
- [ ] **Limitar requests por IP**
  - Prevenir ataques de fuerza bruta en login
  - Configurar límites por endpoint
- [ ] **Rate limit especial para pagos**
  - Prevenir múltiples intentos de pago

### 5.5 Audit Middleware (middlewares/audit.middleware.ts)
- [ ] **Registro de auditoría**
  - Registrar cambios de rol (CU03)
  - Registrar creación de usuarios (CU02)
  - Registrar cambios de perfil (CU17)
  - Log de accesos exitosos y fallidos (CU01)

**Ejemplo de implementación:**

```typescript
// auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    
    // Validar que el usuario esté activo (CU01)
    const user = await prisma.cuentaUsuario.findUnique({
      where: { id_cuenta: req.user.id }
    });
    
    if (!user || user.estado !== 'activo') {
      return res.status(403).json({
        success: false,
        error: 'Usuario inhabilitado, contacte al administrador'
      });
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'La sesión ha caducado, vuelva a iniciar sesión'
      });
    }
    return res.status(403).json({
      success: false,
      error: 'Token inválido'
    });
  }
};

// Middleware de autorización por roles
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.rol !== 'Admin') {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado. Se requiere rol de Administrador'
    });
  }
  next();
};

export const requireAdministrativo = (req: Request, res: Response, next: NextFunction) => {
  if (!['Admin', 'Administrativo'].includes(req.user?.rol)) {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado. Se requiere rol de Administrativo'
    });
  }
  next();
};
```

---

## Fase 6: Validadores (Zod Schemas)

### 6.1 Crear esquemas de validación según casos de uso:

#### auth.validator.ts
- [ ] **loginSchema (CU01)**:
  - email: formato válido (usuario@dominio.tld)
  - contraseña: mínimo 8 caracteres
- [ ] **registerSchema (CU02)**:
  - nombre completo: string requerido
  - dni: integer único requerido
  - email: formato válido y único
  - teléfono: string opcional
  - rol: enum (Admin, Administrativo, Deportista)
  - contraseña: ≥8 caracteres y ≥1 mayúscula

#### user.validator.ts
- [ ] **asignarRolSchema (CU03)**:
  - rol: enum válido
  - validar regla "al menos 1 Admin"
- [ ] **modificarPerfilSchema (CU17)**:
  - email: formato válido y único (excluyendo propio)
  - teléfono: opcional
  - contraseña: opcional (≥8 y ≥1 mayúscula si se proporciona)

#### deportista.validator.ts
- [ ] **createDeportistaSchema**:
  - nombre, apellido, dni (único)
  - fechaNac, categoría, obraSocial
  - estado: enum ('En deuda', 'Al día', 'Morosa', 'Inactiva')
  - id_disciplina, id_domicilio, id_cuenta
- [ ] **updateDeportistaSchema**:
  - validar unicidad de DNI/email al editar

#### grupo-familiar.validator.ts (CU13)
- [ ] **createGrupoFamiliarSchema**:
  - integrantes: array de deportistas
  - deportista_principal: id requerido
  - vínculos: enum (Padre, Madre, Hijo, Hermano, Otro)
  - validar no duplicar composición

#### cuota.validator.ts
- [ ] **asignarCuotaSchema (CU04)**:
  - id_deportista: requerido
  - id_cuota: requerido
  - validar no asignación duplicada para mismo período
- [ ] **actualizarCuotaSchema (CU05)**:
  - monto: decimal > 0
  - periodicidad: enum (mensual, anual, etc.)
  - fechas coherentes (vencimiento > emisión)

#### pago.validator.ts
- [ ] **pagarCuotaSchema (CU08)**:
  - id_cuota: requerido
  - medio_pago: enum (Mercado Pago)
  - validar cuota en estado Pendiente

**Ejemplo de validador completo:**
```typescript
import { z } from 'zod';

// CU01 - Login
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    contraseña: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres')
  })
});

// CU02 - Registrar Usuario
export const registerSchema = z.object({
  body: z.object({
    nombre: z.string().min(2).max(50),
    dni: z.number().int().positive(),
    email: z.string().email('Formato de email incorrecto'),
    telefono: z.string().optional(),
    rol: z.enum(['Admin', 'Administrativo', 'Deportista']),
    contraseña: z.string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
  })
});

// CU05 - Actualizar Cuotas
export const actualizarCuotaSchema = z.object({
  body: z.object({
    nombre: z.string().optional(),
    descripcion: z.string().optional(),
    monto: z.number().positive('El monto debe ser mayor a 0'),
    periodicidad: z.enum(['mensual', 'anual']),
    fechaVencimiento: z.string().datetime().optional(),
    fechaEmision: z.string().datetime().optional()
  })
});
```

---

## Fase 7: Services (Lógica de Negocio)

### 7.1 Auth Service (services/auth.service.ts)
- [ ] **Login (CU01)**: Validar credenciales, verificar estado activo, generar JWT
- [ ] **Registro (CU02)**: Crear usuario con rol, hash de contraseña
- [ ] Generación de JWT con expiración
- [ ] Hash de contraseñas con bcrypt

### 7.2 User Service (services/user.service.ts)
- [ ] **Asignar Rol (CU03)**: Cambiar rol, validar regla "al menos 1 Admin", auditoría
- [ ] **Consultar Perfil (CU16)**: Obtener datos del usuario autenticado
- [ ] **Modificar Perfil (CU17)**: Actualizar email, teléfono, contraseña con validaciones
- [ ] Validar unicidad de email (excluyendo propio ID)

### 7.3 Deportista Service (services/deportista.service.ts)
- [ ] Crear deportista con cuenta de usuario, domicilio, teléfonos, enfermedades
- [ ] Obtener deportista por ID (con relaciones)
- [ ] Listar deportistas (con filtros y paginación)
- [ ] Actualizar datos de deportista
- [ ] Cambiar estado (activo/inactivo/suspendido)
- [ ] Eliminar deportista (considerar soft delete)
- [ ] **Consultar deportistas con pagos pendientes (CU12)**: Filtrar por cuotas pendientes/vencidas
- [ ] **Generar Reporte (CU11)**: Crear PDF/Excel con datos de deportistas
- [ ] **Consultar Historial (CU06)**: Obtener historial de pagos del deportista

### 7.4 Grupo Familiar Service (services/grupo-familiar.service.ts)
- [ ] **Gestionar Grupo Familiar (CU13)**: Crear/actualizar grupos familiares
- [ ] Validar no duplicar grupos con misma composición
- [ ] Definir deportista principal y vínculos (Padre/Madre/Hijo/Hermano/Otro)
- [ ] Listar grupos familiares

### 7.5 Cuota Service (services/cuota.service.ts)
- [ ] **Consultar Cuotas Predefinidas (CU10)**: Listar catálogo de cuotas
- [ ] **Asignar Cuota (CU04)**: Asignar cuota a deportista con validaciones
- [ ] Validar que cuota no esté asignada para el mismo período
- [ ] **Actualizar Cuotas (CU05)**: Modificar monto, periodicidad, validaciones
- [ ] **Ver Estado de Cuenta (CU07)**: Obtener cuotas pagadas, pendientes, total adeudado
- [ ] Generar cuotas mensuales automáticamente (job/cron)
- [ ] Obtener cuotas vencidas
- [ ] Calcular deuda total de un deportista

### 7.6 Pago Service (services/pago.service.ts)
- [ ] **Pagar Cuota (CU08)**: Procesar pago mediante Mercado Pago
- [ ] Validar cuota en estado Pendiente
- [ ] Crear preferencia de pago con Mercado Pago
- [ ] Procesar webhook/IPN de confirmación
- [ ] Actualizar estado de cuota a Pagada
- [ ] Registrar transacción con identificador
- [ ] **Descargar Comprobante (CU15)**: Generar/recuperar PDF de comprobante
- [ ] Obtener pagos por deportista
- [ ] Obtener pagos por fecha



### 7.7 Disciplina Service (services/disciplina.service.ts)
- [ ] Crear disciplina
- [ ] Listar disciplinas
- [ ] Actualizar disciplina (especialmente precio mensual)
- [ ] Obtener deportistas por disciplina

### 7.8 Otros Services necesarios
- [ ] Localidad Service (CRUD básico)
- [ ] Domicilio Service (CRUD básico)
- [ ] Enfermedad Service (CRUD básico)
- [ ] Telefono Service (CRUD básico)
- [ ] Administrativo Service (CRUD básico)

---

## Fase 8: Controllers

### 8.1 Crear controladores según casos de uso del PDF:

#### auth.controller.ts
- [ ] POST /auth/register (CU02 - solo Admin)
- [ ] POST /auth/login (CU01)
- [ ] GET /auth/me (obtener usuario autenticado)
- [ ] POST /auth/logout

#### user.controller.ts
- [ ] PUT /users/:id/role (CU03 - Asignar Rol, solo Admin)
- [ ] GET /users/profile (CU16 - Consultar Perfil)
- [ ] PUT /users/profile (CU17 - Modificar Perfil)

#### deportista.controller.ts
- [ ] POST /deportistas (crear, solo Administrativo)
- [ ] GET /deportistas (listar, solo Administrativo)
- [ ] GET /deportistas/:id (obtener uno)
- [ ] PUT /deportistas/:id (actualizar, solo Administrativo)
- [ ] DELETE /deportistas/:id (eliminar, solo Administrativo)
- [ ] GET /deportistas/pagos-pendientes (CU12 - solo Administrativo)
- [ ] GET /deportistas/:id/historial (CU06 - Deportista propio o Admin)
- [ ] POST /deportistas/reporte (CU11 - Generar Reporte PDF/Excel)

#### grupo-familiar.controller.ts
- [ ] POST /grupos-familiares (CU13, solo Administrativo)
- [ ] GET /grupos-familiares (listar)
- [ ] PUT /grupos-familiares/:id (actualizar)
- [ ] DELETE /grupos-familiares/:id

#### cuota.controller.ts
- [ ] GET /cuotas/predefinidas (CU10 - Consultar Cuotas Predefinidas)
- [ ] POST /cuotas/asignar (CU04 - Asignar Cuota, solo Administrativo)
- [ ] PUT /cuotas/:id (CU05 - Actualizar Cuotas, solo Administrativo)
- [ ] GET /cuotas/estado-cuenta (CU07 - Ver Estado de Cuenta, Deportista)
- [ ] GET /cuotas/deportista/:id (cuotas de un deportista específico)

#### pago.controller.ts
- [ ] POST /pagos/crear (CU08 - Pagar Cuota, Deportista)
- [ ] POST /pagos/webhook (recibir confirmación de Mercado Pago)
- [ ] GET /pagos/:id (obtener un pago)
- [ ] GET /pagos/:id/comprobante (CU15 - Descargar Comprobante)

#### disciplina.controller.ts
- [ ] POST /disciplinas (crear)
- [ ] GET /disciplinas (listar)
- [ ] GET /disciplinas/:id (obtener una)
- [ ] PUT /disciplinas/:id (actualizar precio mensual)
- [ ] GET /disciplinas/:id/deportistas (deportistas por disciplina)



---

## Fase 9: Routes

### 9.1 Configurar rutas para cada módulo:
- [ ] routes/auth.routes.ts
- [ ] routes/deportista.routes.ts
- [ ] routes/cuota.routes.ts
- [ ] routes/pago.routes.ts
- [ ] routes/disciplina.routes.ts
- [ ] routes/administrativo.routes.ts
- [ ] routes/index.ts (agrupa todas las rutas)

### 9.2 Aplicar middlewares apropiados:
- [ ] Validación en cada ruta
- [ ] Autenticación donde sea necesario
- [ ] Autorización por roles (si aplica)

---

## Fase 10: Configuración de Express (app.ts y server.ts)

### 10.1 app.ts
- [ ] Configurar middleware de CORS
- [ ] Configurar helmet para seguridad
- [ ] Configurar express.json()
- [ ] Configurar express.urlencoded()
- [ ] Montar rutas principales
- [ ] Configurar middleware de error global

### 10.2 server.ts
- [ ] Importar app
- [ ] Configurar puerto
- [ ] Iniciar servidor
- [ ] Manejar signals de terminación

---

## Fase 11: Testing y Documentación

### 11.1 Testing
- [ ] Configurar Jest
- [ ] Tests unitarios para services
- [ ] Tests de integración para endpoints
- [ ] Tests de autenticación

### 11.2 Documentación
- [ ] README.md con instrucciones de instalación
- [ ] Documentación de API (Swagger/OpenAPI opcional)
- [ ] Comentarios en código donde sea necesario

---

## Fase 12: Features Adicionales

### 12.1 Integración con Mercado Pago (CU08)
- [ ] **Configuración de SDK de Mercado Pago**
  - Instalar `mercadopago` SDK
  - Configurar credenciales (access token)
  - Setup de webhooks para IPN/notificaciones
- [ ] **Crear preferencia de pago**
  - Generar preferencia con datos de cuota
  - Incluir URLs de retorno (success, failure, pending)
  - Configurar métodos de pago habilitados
- [ ] **Procesar webhook/IPN**
  - Endpoint POST /pagos/webhook
  - Validar firma de Mercado Pago
  - Actualizar estado de pago según notificación
  - Registrar transacción completa
- [ ] **Healthcheck de servicio**
  - Validar que medio de pago esté operativo (CU08)
  - Timeout handling



### 12.2 Generación de Reportes (CU11)
- [ ] **PDF con PDFKit o Puppeteer**
  - Reporte de deportistas con datos completos
  - Logo y formato del club
  - Exportación de comprobantes de pago (CU15)
- [ ] **Excel con ExcelJS**
  - Exportar listado de deportistas
  - Exportar cuotas pendientes (CU12)
  - Exportar historial de pagos

### 12.3 Funcionalidades Avanzadas
- [ ] Dashboard con estadísticas para Admin/Administrativo
- [ ] Sistema de auditoría completo (registro de todas las acciones)
- [ ] Grupos familiares con descuentos automáticos (CU13)
- [ ] Calculadora de deuda con intereses por mora


### 12.4 Optimizaciones
- [ ] **Caché con Redis** (opcional)
  - Cache de cuotas predefinidas (CU10)
  - Cache de listados frecuentes
- [ ] **Rate limiting**
  - Protección contra ataques de fuerza bruta
  - Límites por endpoint
- [ ] **Logging con Winston/Pino**
  - Logs estructurados
  - Diferentes niveles (info, warn, error)
  - Rotación de archivos
- [ ] **Monitoreo de performance**
  - Métricas de tiempos de respuesta
  - Alertas de errores críticos

---

## Casos de Uso Detallados (Según Documento PDF)

### 1) Autenticación y Usuarios

#### CU01 – Autenticar Usuario
**Actor:** Usuario (Admin, Administrativo, Deportista)
**Descripción:** Login al sistema con email y contraseña
**Validaciones:**
- Email formato válido (usuario@dominio.tld)
- Contraseña mínimo 8 caracteres
- Usuario debe estar activo
- Hash de contraseña con bcrypt/argon2

#### CU02 – Registrar Usuario
**Actor:** Admin
**Descripción:** Crear nuevo usuario en el sistema
**Campos:**
- Nombre completo (string, requerido)
- DNI (integer, único, requerido)
- Email (string, único, formato válido)
- Teléfono (string, opcional)
- Rol (enum: Admin, Administrativo, Deportista)
- Contraseña (mínimo 8 caracteres, ≥1 mayúscula)
**Validaciones:**
- DNI y email únicos
- Contraseña con regex: longitud ≥8 y al menos 1 mayúscula


#### CU03 – Asignar Rol
**Actor:** Admin
**Descripción:** Cambiar rol de un usuario existente
**Validaciones:**
- No dejar el sistema sin al menos 1 Admin activo
- Registrar auditoría del cambio

#### CU16 – Consultar Perfil
**Actor:** Usuario (todos los roles)
**Descripción:** Ver datos personales y de cuenta
**Modo:** Solo lectura

#### CU17 – Modificar Perfil
**Actor:** Usuario (todos los roles)
**Descripción:** Actualizar datos propios
**Campos editables:**
- Email (validar unicidad)
- Teléfono
- Contraseña (≥8 y ≥1 mayúscula)

---

### 2) Gestión de Deportistas

#### CU11 – Generar Reporte
**Actor:** Administrativo
**Descripción:** Generar reporte PDF/Excel de deportistas
**Dataset incluye:**
- Nombre
- Deporte
- Categoría
- Fecha de último pago
- Estado de pago

#### CU12 – Consultar Deportistas con Pagos Pendientes
**Actor:** Administrativo
**Descripción:** Listar deportistas con cuotas pendientes/vencidas
**Muestra:**
- Nombre
- DNI
- Cantidad y monto de deudas
- Vencimiento más próximo

#### CU14 – Gestionar Deportistas
**Actor:** Administrativo
**Descripción:** CRUD de deportistas
**Acciones:**
- Editar deportista
- Eliminar deportista
- Asignar a grupo familiar
**Validaciones:**
- Unicidad de DNI/email al editar

#### CU13 – Gestionar Grupo Familiar
**Actor:** Administrativo
**Descripción:** Agrupar deportistas en familia
**Campos:**
- Deportista principal
- Vínculos (Padre/Madre/Hijo/Hermano/Otro)
**Validaciones:**
- No duplicar grupos con misma composición

#### CU06 – Consultar Historial
**Actor:** Deportista
**Descripción:** Ver historial de pagos propios
**Muestra:**
- Fecha
- Monto
- Medio de pago
- Estado (aprobado/rechazado/pendiente)

---

### 3) Gestión de Cuotas

#### CU10 – Consultar Cuotas Predefinidas
**Actor:** Administrativo
**Descripción:** Ver catálogo de cuotas disponibles
**Muestra:**
- Monto
- Fecha de vencimiento
- Estado
- Nº de cuota
- Fecha de emisión

#### CU04 – Asignar Cuota
**Actor:** Administrativo
**Descripción:** Asignar cuota a deportista
**Validaciones:**
- Cuota no asignada al deportista para el mismo período
- Estado inicial: Pendiente

#### CU05 – Actualizar Cuotas
**Actor:** Administrativo
**Descripción:** Modificar configuración de cuotas
**Campos editables:**
- Nombre
- Descripción
- Monto (debe ser > 0)
- Periodicidad (mensual, anual, etc.)
**Validaciones:**
- Fechas coherentes (vencimiento > emisión)

#### CU07 – Ver Estado de Cuenta
**Actor:** Deportista
**Descripción:** Visualizar cuotas propias
**Muestra:**
- Cuotas pagadas (monto/fecha/medio)
- Cuotas pendientes (monto/vencimiento)
- Total adeudado

#### CU08 – Pagar Cuota
**Actor:** Deportista
**Descripción:** Pagar cuota mediante Mercado Pago
**Precondiciones:**
- Cuota en estado Pendiente
- Medio de pago operativo
**Flujo:**
1. Seleccionar cuota y medio de pago
2. Validar estado y disponibilidad
3. Procesar pago con proveedor externo
4. Actualizar estado a Pagada
5. Registrar transacción
6. Enviar notificación

#### CU09 – Enviar Notificación
**Actor:** Sistema (automático)
**Descripción:** Notificar eventos de cuotas
**Canales:**
- Email
- WhatsApp
**Eventos:**
- Nuevos vencimientos
- Confirmaciones de pago
**Validaciones:**
- Canal disponible (credenciales, cuota de envío)
- Reintento exponencial en caso de fallo

#### CU15 – Descargar Comprobante
**Actor:** Deportista
**Descripción:** Descargar PDF de comprobante de pago
**Precondiciones:**
- Pago exitoso registrado
- Comprobante disponible

---

## Orden de Implementación Recomendado (Según Casos de Uso del PDF)

### Sprint 1: Fundamentos y Autenticación (Semana 1-2)
**Objetivo:** Sistema base funcional con autenticación

1. **Setup del proyecto** (Fase 1)
   - Configuración inicial
   - Estructura de carpetas
   - Variables de entorno

2. **Configuración de Prisma** (Fase 2)
   - Definir schema completo según diagrama
   - Crear migraciones
   - Generar Prisma Client

3. **Tipos de TypeScript** (Fase 3)
   - Interfaces de modelos
   - DTOs
   - Enums (EstadoDeportista, EstadoCuota, EstadoPago, etc.)

4. **Autenticación** (CU01, CU02, CU03)
   - Auth middleware con JWT
   - Auth service (login, registro)
   - Auth controller y routes
   - Validadores de auth
   - **Entregable:** Login funcional + Registro de usuarios por Admin

### Sprint 2: Gestión de Usuarios y Perfiles (Semana 2-3)
**Objetivo:** Gestión completa de usuarios

1. **User Service y Controllers** (CU16, CU17)
   - Consultar perfil propio
   - Modificar perfil propio
   - Asignar roles (solo Admin)

2. **Middlewares de autorización**
   - requireAdmin
   - requireAdministrativo
   - requireDeportista

3. **Sistema de auditoría básico**
   - Registrar cambios de rol
   - Registrar accesos

**Entregable:** Sistema de usuarios con roles funcional

### Sprint 3: Gestión de Deportistas y Entidades Base (Semana 3-4)
**Objetivo:** CRUD completo de deportistas

1. **Entidades auxiliares**
   - Localidad, Domicilio, Telefono, Enfermedad
   - Services, controllers, validadores básicos

2. **Disciplinas**
   - CRUD completo
   - Precio mensual

3. **Deportistas** (CU14, CU06)
   - Crear deportista con relaciones
   - Listar/actualizar/eliminar
   - Consultar historial (vista deportista)

4. **Grupos Familiares** (CU13)
   - Crear/gestionar grupos
   - Validar duplicados

**Entregable:** Gestión completa de deportistas y familias

### Sprint 4: Gestión de Cuotas (Semana 4-5)
**Objetivo:** Sistema de cuotas funcional

1. **Cuotas predefinidas** (CU10, CU05)
   - Consultar cuotas predefinidas
   - Actualizar cuotas (monto, periodicidad)

2. **Asignación de cuotas** (CU04)
   - Asignar cuota a deportista
   - Validaciones de período

3. **Estado de cuenta** (CU07)
   - Ver cuotas pagadas/pendientes
   - Calcular deuda total

4. **Consulta de pendientes** (CU12)
   - Deportistas con pagos pendientes
   - Filtros y ordenamiento

**Entregable:** Sistema de cuotas operativo sin pagos

### Sprint 5: Pagos y Mercado Pago (Semana 5-6)
**Objetivo:** Pagos online funcionales

1. **Integración Mercado Pago** (CU08)
   - Setup SDK
   - Crear preferencias de pago
   - Procesar webhooks
   - Validaciones de estado

2. **Comprobantes** (CU15)
   - Generar PDF de comprobante
   - Descargar comprobante

3. **Notificaciones** (CU09)
   - Email de confirmación de pago
   - Email de vencimientos
   - Sistema de reintentos

**Entregable:** Pago de cuotas online funcional

### Sprint 6: Reportes y Refinamiento (Semana 6-7)
**Objetivo:** Sistema completo y pulido

1. **Generación de Reportes** (CU11)
   - Reporte PDF de deportistas
   - Exportación Excel

2. **Testing**
   - Tests unitarios de services críticos
   - Tests de integración de endpoints principales
   - Tests de autenticación

3. **Refinamiento**
   - Mensajes de error consistentes
   - Validaciones exhaustivas
   - Documentación de API

4. **Features adicionales opcionales**
   - Dashboard con estadísticas
   - Sistema de recordatorios automatizados
   - Optimizaciones de performance

**Entregable:** Sistema completo y testeado

---

## Checklist por Sprint

### ✅ Sprint 1 - Listo cuando:
- [ ] Usuario Admin puede hacer login
- [ ] Usuario Admin puede registrar nuevos usuarios
- [ ] JWT funciona correctamente con expiración
- [ ] Contraseñas hasheadas con bcrypt
- [ ] Mensajes de error en español según PDF

### ✅ Sprint 2 - Listo cuando:
- [ ] Usuario puede ver su perfil
- [ ] Usuario puede modificar su perfil
- [ ] Admin puede asignar roles
- [ ] Validación "al menos 1 Admin" funciona
- [ ] Auditoría registra cambios importantes

### ✅ Sprint 3 - Listo cuando:
- [ ] Administrativo puede crear deportistas
- [ ] Deportista puede ver su historial
- [ ] Grupos familiares se pueden crear
- [ ] Todas las relaciones funcionan correctamente
- [ ] Disciplinas tienen precio mensual

### ✅ Sprint 4 - Listo cuando:
- [ ] Administrativo puede consultar cuotas predefinidas
- [ ] Administrativo puede asignar cuotas
- [ ] Deportista ve su estado de cuenta
- [ ] Se listan deportistas con pagos pendientes
- [ ] Validación de período funciona

### ✅ Sprint 5 - Listo cuando:
- [ ] Deportista puede pagar cuota con Mercado Pago
- [ ] Webhook actualiza estado de pago
- [ ] Se genera comprobante PDF
- [ ] Se envía email de confirmación
- [ ] Notificaciones de vencimiento funcionan

### ✅ Sprint 6 - Listo cuando:
- [ ] Reporte PDF/Excel se genera correctamente
- [ ] Tests principales pasan
- [ ] Documentación está completa
- [ ] Sistema está listo para despliegue

---

## Checklist de Seguridad

- [ ] Contraseñas hasheadas con bcrypt
- [ ] Validación de entrada en todos los endpoints
- [ ] Rate limiting implementado
- [ ] CORS configurado correctamente
- [ ] Headers de seguridad con Helmet
- [ ] Variables sensibles en .env
- [ ] SQL Injection protegido (Prisma lo maneja)
- [ ] XSS protegido
- [ ] Tokens JWT con expiración

---

## Comandos Útiles

```bash
# Instalación inicial
npm init -y
npm install express typescript ts-node @types/node @types/express
npm install prisma @prisma/client
npm install dotenv cors helmet
npm install zod
npm install jsonwebtoken @types/jsonwebtoken
npm install bcryptjs @types/bcryptjs

# Prisma
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio

# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start
```

---

## Notas Importantes

1. **Transacciones**: Usar transacciones de Prisma para operaciones que involucren múltiples tablas (ej: crear deportista con domicilio y cuenta)

2. **Soft Delete**: Considerar agregar campos `deletedAt` para soft deletes

3. **Auditoría**: Considerar agregar `createdAt`, `updatedAt` en todas las tablas

4. **Índices**: Optimizar queries con índices en campos frecuentemente buscados (dni, mail, etc.)

5. **Paginación**: Implementar paginación en todos los listados

6. **Filtros**: Permitir filtrado por múltiples campos en endpoints de listado

---

## Recursos Adicionales

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express TypeScript Guide](https://expressjs.com/)
- [Zod Documentation](https://zod.dev/)
- [Supabase Docs](https://supabase.com/docs)

---

**Última actualización**: 2026-02-04
**Versión del plan**: 1.0
