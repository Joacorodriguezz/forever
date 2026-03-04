# QA Manual - Guia de Pruebas de Endpoints

Este documento describe como probar manualmente todos los endpoints de la API del sistema.

## Configuracion Inicial

### URL Base
```
http://localhost:3000/api
```

### Herramientas Recomendadas
- **Postman** (recomendado)
- **Insomnia**
- **cURL** (linea de comandos)
- **Thunder Client** (extension VS Code)

### Autenticacion
La mayoria de los endpoints requieren un token JWT. Para obtenerlo:
1. Hacer login con `/api/auth/login`
2. Copiar el token de la respuesta
3. Incluir en headers: `Authorization: Bearer <token>`

---

## 1. Health Check

### GET /health
**Descripcion:** Verificar que el servidor esta funcionando.

**Autenticacion:** No requerida

```bash
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "status": "ok"
}
```

---

## 2. Autenticacion (`/api/auth`)

### POST /api/auth/login
**Descripcion:** Iniciar sesion y obtener token JWT.

**Autenticacion:** No requerida

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Password123"
  }'
```

**Body:**
| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| email | string | Si | Email valido |
| password | string | Si | Minimo 8 caracteres |

**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "rol": "ADMIN"
  }
}
```

---

### POST /api/auth/register
**Descripcion:** Registrar un nuevo usuario.

**Autenticacion:** Solo ADMIN

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Juan",
    "apellido": "Perez",
    "dni": "12345678",
    "email": "juan@example.com",
    "password": "Password123",
    "telefono": "1122334455",
    "rol": "DEPORTISTA"
  }'
```

**Body:**
| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| nombre | string | Si | 2-50 caracteres |
| apellido | string | Si | 2-50 caracteres |
| dni | string | Si | 7-8 digitos |
| email | string | Si | Email valido |
| password | string | Si | Min 8 chars, 1 mayuscula |
| telefono | string | No | - |
| rol | string | Si | ADMIN / ADMINISTRATIVO / DEPORTISTA |

---

### GET /api/auth/me
**Descripcion:** Obtener datos del usuario autenticado.

**Autenticacion:** Requerida

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

---

## 3. Usuarios (`/api/users`)

### GET /api/users
**Descripcion:** Listar todos los usuarios.

**Autenticacion:** Solo ADMIN

```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer <token>"
```

---

### GET /api/users/profile
**Descripcion:** Obtener perfil del usuario logueado.

**Autenticacion:** Requerida

```bash
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <token>"
```

---

### PUT /api/users/profile
**Descripcion:** Actualizar perfil propio.

**Autenticacion:** Requerida

```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "email": "nuevoemail@example.com",
    "telefono": "1199887766",
    "password": "NuevaPassword123"
  }'
```

**Body (todos opcionales):**
| Campo | Tipo | Validacion |
|-------|------|------------|
| email | string | Email valido |
| telefono | string | - |
| password | string | Min 8 chars, 1 mayuscula |

---

### PUT /api/users/:id/role
**Descripcion:** Asignar rol a un usuario.

**Autenticacion:** Solo ADMIN

```bash
curl -X PUT http://localhost:3000/api/users/5/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "rol": "ADMINISTRATIVO"
  }'
```

**Body:**
| Campo | Tipo | Requerido | Valores |
|-------|------|-----------|---------|
| rol | string | Si | ADMIN / ADMINISTRATIVO / DEPORTISTA |

---

## 4. Deportistas (`/api/deportistas`)

### POST /api/deportistas
**Descripcion:** Crear un nuevo deportista.

**Autenticacion:** Solo ADMIN

```bash
curl -X POST http://localhost:3000/api/deportistas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Carlos",
    "apellido": "Garcia",
    "dni": "33445566",
    "fechaNac": "1995-05-15",
    "categoria": "Senior",
    "obraSocial": "OSDE",
    "disciplinaId": 1,
    "email": "carlos@example.com",
    "password": "Password123",
    "domicilio": {
      "calle": "Av. Libertador",
      "numero": "1234",
      "piso": "3",
      "departamento": "A",
      "localidadId": 1
    },
    "telefonos": ["1122334455", "1166778899"],
    "enfermedades": ["Asma"]
  }'
```

**Body:**
| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| nombre | string | Si | 2-50 caracteres |
| apellido | string | Si | 2-50 caracteres |
| dni | string | Si | 7-8 digitos |
| fechaNac | string | Si | Formato fecha |
| categoria | string | No | - |
| obraSocial | string | No | - |
| disciplinaId | number | Si | ID existente |
| email | string | Si | Email valido |
| password | string | Si | Min 8 chars, 1 mayuscula |
| domicilio | object | Si | Ver estructura abajo |
| telefonos | array | No | Array de strings |
| enfermedades | array | No | Array de strings |

**Estructura domicilio:**
```json
{
  "calle": "string (requerido)",
  "numero": "string (requerido)",
  "piso": "string (opcional)",
  "departamento": "string (opcional)",
  "localidadId": "number (requerido)"
}
```

---

### GET /api/deportistas
**Descripcion:** Listar deportistas con filtros y paginacion.

**Autenticacion:** Solo ADMIN

```bash
# Sin filtros
curl "http://localhost:3000/api/deportistas" \
  -H "Authorization: Bearer <token>"

# Con filtros
curl "http://localhost:3000/api/deportistas?page=1&limit=10&estado=AL_DIA&disciplinaId=1&search=Garcia" \
  -H "Authorization: Bearer <token>"
```

**Query Parameters:**
| Parametro | Tipo | Valores |
|-----------|------|---------|
| page | number | Numero de pagina |
| limit | number | Cantidad por pagina |
| estado | string | EN_DEUDA / AL_DIA / MOROSA / INACTIVA |
| disciplinaId | number | ID de disciplina |
| search | string | Buscar por nombre/apellido |

---

### GET /api/deportistas/:id
**Descripcion:** Obtener deportista por ID.

**Autenticacion:** Solo ADMIN

```bash
curl http://localhost:3000/api/deportistas/1 \
  -H "Authorization: Bearer <token>"
```

---

### PUT /api/deportistas/:id
**Descripcion:** Actualizar datos de un deportista.

**Autenticacion:** Solo ADMIN

```bash
curl -X PUT http://localhost:3000/api/deportistas/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Carlos Alberto",
    "categoria": "Master",
    "obraSocial": "Swiss Medical"
  }'
```

**Body (todos opcionales):**
| Campo | Tipo |
|-------|------|
| nombre | string |
| apellido | string |
| fechaNac | string |
| categoria | string |
| obraSocial | string |
| disciplinaId | number |
| domicilio | object (parcial) |
| telefonos | array |
| enfermedades | array |

---

### DELETE /api/deportistas/:id
**Descripcion:** Eliminar un deportista.

**Autenticacion:** Solo ADMIN

```bash
curl -X DELETE http://localhost:3000/api/deportistas/1 \
  -H "Authorization: Bearer <token>"
```

---

### GET /api/deportistas/:id/historial
**Descripcion:** Obtener historial de pagos de un deportista.

**Autenticacion:** Solo ADMIN

```bash
curl http://localhost:3000/api/deportistas/1/historial \
  -H "Authorization: Bearer <token>"
```

---

### GET /api/deportistas/pagos-pendientes
**Descripcion:** Listar deportistas con pagos pendientes.

**Autenticacion:** Solo ADMIN

```bash
curl http://localhost:3000/api/deportistas/pagos-pendientes \
  -H "Authorization: Bearer <token>"
```

---

### GET /api/deportistas/mi-perfil
**Descripcion:** Obtener perfil del deportista logueado.

**Autenticacion:** Solo DEPORTISTA

```bash
curl http://localhost:3000/api/deportistas/mi-perfil \
  -H "Authorization: Bearer <token_deportista>"
```

---

### GET /api/deportistas/mi-historial
**Descripcion:** Obtener historial de pagos del deportista logueado.

**Autenticacion:** Solo DEPORTISTA

```bash
curl http://localhost:3000/api/deportistas/mi-historial \
  -H "Authorization: Bearer <token_deportista>"
```

---

## 5. Cuotas (`/api/cuotas`)

### POST /api/cuotas/asignar
**Descripcion:** Asignar una cuota a un deportista.

**Autenticacion:** Solo ADMIN

```bash
curl -X POST http://localhost:3000/api/cuotas/asignar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "deportistaId": 1,
    "nroCuota": 1,
    "monto": 5000,
    "fechaEmision": "2024-01-01",
    "fechaVencimiento": "2024-01-15",
    "disciplinaId": 1
  }'
```

**Body:**
| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| deportistaId | number | Si | ID existente |
| nroCuota | number | Si | Numero entero |
| monto | number | Si | Mayor a 0 |
| fechaEmision | string | Si | Formato fecha |
| fechaVencimiento | string | Si | Formato fecha |
| disciplinaId | number | Si | ID existente |

---

### GET /api/cuotas/predefinidas
**Descripcion:** Consultar cuotas predefinidas del sistema.

**Autenticacion:** Solo ADMIN

```bash
curl http://localhost:3000/api/cuotas/predefinidas \
  -H "Authorization: Bearer <token>"
```

---

### GET /api/cuotas/mi-estado
**Descripcion:** Estado de cuenta del deportista logueado.

**Autenticacion:** Solo DEPORTISTA

```bash
curl http://localhost:3000/api/cuotas/mi-estado \
  -H "Authorization: Bearer <token_deportista>"
```

---

### GET /api/cuotas/deportista/:deportistaId
**Descripcion:** Obtener cuotas de un deportista especifico.

**Autenticacion:** Solo ADMIN

```bash
# Sin filtros
curl http://localhost:3000/api/cuotas/deportista/1 \
  -H "Authorization: Bearer <token>"

# Con filtros
curl "http://localhost:3000/api/cuotas/deportista/1?page=1&limit=10&estado=PENDIENTE" \
  -H "Authorization: Bearer <token>"
```

**Query Parameters:**
| Parametro | Tipo | Valores |
|-----------|------|---------|
| page | number | Numero de pagina |
| limit | number | Cantidad por pagina |
| estado | string | PAGADA / PENDIENTE / VENCIDA |

---

### GET /api/cuotas/estado-cuenta/:deportistaId
**Descripcion:** Estado de cuenta de un deportista especifico.

**Autenticacion:** Solo ADMIN

```bash
curl http://localhost:3000/api/cuotas/estado-cuenta/1 \
  -H "Authorization: Bearer <token>"
```

---

### GET /api/cuotas/:id
**Descripcion:** Obtener una cuota por ID.

**Autenticacion:** Requerida

```bash
curl http://localhost:3000/api/cuotas/1 \
  -H "Authorization: Bearer <token>"
```

---

### PUT /api/cuotas/:id
**Descripcion:** Actualizar una cuota.

**Autenticacion:** Solo ADMIN

```bash
curl -X PUT http://localhost:3000/api/cuotas/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "monto": 5500,
    "fechaVencimiento": "2024-01-20",
    "periodicidad": "MENSUAL"
  }'
```

**Body (todos opcionales):**
| Campo | Tipo | Valores |
|-------|------|---------|
| monto | number | Mayor a 0 |
| fechaVencimiento | string | Formato fecha |
| periodicidad | string | MENSUAL / ANUAL |

---

## 6. Pagos (`/api/pagos`)

### POST /api/pagos/crear
**Descripcion:** Crear un pago para una cuota (genera link de Mercado Pago).

**Autenticacion:** Solo DEPORTISTA

```bash
curl -X POST http://localhost:3000/api/pagos/crear \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token_deportista>" \
  -d '{
    "cuotaId": 1,
    "medioPago": "Mercado Pago"
  }'
```

**Body:**
| Campo | Tipo | Requerido | Default |
|-------|------|-----------|---------|
| cuotaId | number | Si | - |
| medioPago | string | No | "Mercado Pago" |

---

### POST /api/pagos/webhook
**Descripcion:** Webhook para notificaciones de Mercado Pago.

**Autenticacion:** No requerida

```bash
curl -X POST http://localhost:3000/api/pagos/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "data": {
      "id": "123456789"
    }
  }'
```

> **Nota:** Este endpoint es llamado automaticamente por Mercado Pago.

---

### GET /api/pagos/mis-pagos
**Descripcion:** Obtener pagos del deportista logueado.

**Autenticacion:** Solo DEPORTISTA

```bash
curl http://localhost:3000/api/pagos/mis-pagos \
  -H "Authorization: Bearer <token_deportista>"
```

---

### GET /api/pagos/deportista/:deportistaId
**Descripcion:** Obtener pagos de un deportista especifico.

**Autenticacion:** Solo ADMIN

```bash
curl http://localhost:3000/api/pagos/deportista/1 \
  -H "Authorization: Bearer <token>"
```

---

### GET /api/pagos/:id
**Descripcion:** Obtener un pago por ID.

**Autenticacion:** Requerida

```bash
curl http://localhost:3000/api/pagos/1 \
  -H "Authorization: Bearer <token>"
```

---

### POST /api/pagos/:id/confirmar
**Descripcion:** Confirmar un pago manualmente.

**Autenticacion:** Solo ADMIN

```bash
curl -X POST http://localhost:3000/api/pagos/1/confirmar \
  -H "Authorization: Bearer <token>"
```

---

## 7. Disciplinas (`/api/disciplinas`)

### POST /api/disciplinas
**Descripcion:** Crear una nueva disciplina.

**Autenticacion:** Solo ADMIN

```bash
curl -X POST http://localhost:3000/api/disciplinas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Futbol",
    "descripcion": "Futbol 11 categoria senior",
    "precioMensual": 8000
  }'
```

**Body:**
| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| nombre | string | Si | 2-100 caracteres |
| descripcion | string | No | - |
| precioMensual | number | Si | Mayor a 0 |

---

### GET /api/disciplinas
**Descripcion:** Listar todas las disciplinas.

**Autenticacion:** Requerida

```bash
curl http://localhost:3000/api/disciplinas \
  -H "Authorization: Bearer <token>"
```

---

### GET /api/disciplinas/:id
**Descripcion:** Obtener una disciplina por ID.

**Autenticacion:** Requerida

```bash
curl http://localhost:3000/api/disciplinas/1 \
  -H "Authorization: Bearer <token>"
```

---

### PUT /api/disciplinas/:id
**Descripcion:** Actualizar una disciplina.

**Autenticacion:** Solo ADMIN

```bash
curl -X PUT http://localhost:3000/api/disciplinas/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Futbol 5",
    "precioMensual": 9000,
    "activa": true
  }'
```

**Body (todos opcionales):**
| Campo | Tipo | Valores |
|-------|------|---------|
| nombre | string | 2-100 caracteres |
| descripcion | string | - |
| precioMensual | number | Mayor a 0 |
| activa | boolean | true / false |

---

### GET /api/disciplinas/:id/deportistas
**Descripcion:** Obtener deportistas de una disciplina.

**Autenticacion:** Solo ADMIN

```bash
curl http://localhost:3000/api/disciplinas/1/deportistas \
  -H "Authorization: Bearer <token>"
```

---

## 8. Grupos Familiares (`/api/grupos-familiares`)

### POST /api/grupos-familiares
**Descripcion:** Crear un grupo familiar.

**Autenticacion:** Solo ADMIN

```bash
curl -X POST http://localhost:3000/api/grupos-familiares \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Familia Garcia",
    "integrantes": [
      {
        "deportistaId": 1,
        "vinculo": "PADRE",
        "esPrincipal": true
      },
      {
        "deportistaId": 2,
        "vinculo": "HIJO",
        "esPrincipal": false
      }
    ]
  }'
```

**Body:**
| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| nombre | string | Si | - |
| integrantes | array | Si | Minimo 2 integrantes |

**Estructura integrante:**
| Campo | Tipo | Requerido | Valores |
|-------|------|-----------|---------|
| deportistaId | number | Si | ID existente |
| vinculo | string | Si | PADRE / MADRE / HIJO / HERMANO / OTRO |
| esPrincipal | boolean | No | Exactamente 1 debe ser true |

---

### GET /api/grupos-familiares
**Descripcion:** Listar todos los grupos familiares.

**Autenticacion:** Solo ADMIN

```bash
curl http://localhost:3000/api/grupos-familiares \
  -H "Authorization: Bearer <token>"
```

---

### GET /api/grupos-familiares/:id
**Descripcion:** Obtener un grupo familiar por ID.

**Autenticacion:** Solo ADMIN

```bash
curl http://localhost:3000/api/grupos-familiares/1 \
  -H "Authorization: Bearer <token>"
```

---

### PUT /api/grupos-familiares/:id
**Descripcion:** Actualizar un grupo familiar.

**Autenticacion:** Solo ADMIN

```bash
curl -X PUT http://localhost:3000/api/grupos-familiares/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Familia Garcia Martinez",
    "integrantes": [
      {
        "deportistaId": 1,
        "vinculo": "PADRE",
        "esPrincipal": true
      },
      {
        "deportistaId": 2,
        "vinculo": "HIJO",
        "esPrincipal": false
      },
      {
        "deportistaId": 3,
        "vinculo": "HIJO",
        "esPrincipal": false
      }
    ]
  }'
```

---

### DELETE /api/grupos-familiares/:id
**Descripcion:** Eliminar un grupo familiar.

**Autenticacion:** Solo ADMIN

```bash
curl -X DELETE http://localhost:3000/api/grupos-familiares/1 \
  -H "Authorization: Bearer <token>"
```

---

## Codigos de Respuesta HTTP

| Codigo | Significado |
|--------|-------------|
| 200 | OK - Operacion exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos invalidos |
| 401 | Unauthorized - Token invalido o faltante |
| 403 | Forbidden - Sin permisos para la accion |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (ej: email duplicado) |
| 500 | Internal Server Error - Error del servidor |

---

## Flujo de Prueba Recomendado

### Paso 1: Verificar servidor
```bash
curl http://localhost:3000/health
```

### Paso 2: Login como Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "Password123"}'
```
> Guardar el token recibido

### Paso 3: Crear una disciplina
```bash
curl -X POST http://localhost:3000/api/disciplinas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"nombre": "Natacion", "precioMensual": 7500}'
```

### Paso 4: Crear un deportista
```bash
curl -X POST http://localhost:3000/api/deportistas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Maria",
    "apellido": "Lopez",
    "dni": "44556677",
    "fechaNac": "2000-03-20",
    "disciplinaId": 1,
    "email": "maria@example.com",
    "password": "Password123",
    "domicilio": {
      "calle": "Calle Falsa",
      "numero": "123",
      "localidadId": 1
    }
  }'
```

### Paso 5: Asignar cuota al deportista
```bash
curl -X POST http://localhost:3000/api/cuotas/asignar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "deportistaId": 1,
    "nroCuota": 1,
    "monto": 7500,
    "fechaEmision": "2024-02-01",
    "fechaVencimiento": "2024-02-15",
    "disciplinaId": 1
  }'
```

### Paso 6: Login como Deportista
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "maria@example.com", "password": "Password123"}'
```

### Paso 7: Ver estado de cuenta
```bash
curl http://localhost:3000/api/cuotas/mi-estado \
  -H "Authorization: Bearer <token_deportista>"
```

### Paso 8: Crear pago
```bash
curl -X POST http://localhost:3000/api/pagos/crear \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token_deportista>" \
  -d '{"cuotaId": 1}'
```

---

## Tips para Postman

1. **Variables de entorno:**
   - `base_url`: `http://localhost:3000`
   - `token`: Token JWT del admin
   - `token_deportista`: Token JWT del deportista

2. **Configurar Authorization:**
   - Tipo: Bearer Token
   - Token: `{{token}}`

3. **Pre-request Script para auto-login:**
```javascript
pm.sendRequest({
    url: pm.environment.get("base_url") + "/api/auth/login",
    method: "POST",
    header: { "Content-Type": "application/json" },
    body: {
        mode: "raw",
        raw: JSON.stringify({
            email: "admin@example.com",
            password: "Password123"
        })
    }
}, function(err, res) {
    pm.environment.set("token", res.json().token);
});
```

---

## Notas Importantes

- El servidor debe estar corriendo en `localhost:3000`
- Asegurate de tener la base de datos configurada y con datos iniciales
- Los IDs usados en los ejemplos (1, 2, etc.) son ilustrativos, usa los IDs reales de tu base de datos
- Para probar endpoints de Deportista, necesitas loguearte con credenciales de un usuario con rol DEPORTISTA
