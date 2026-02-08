# 🚀 Guía de Pruebas API - Forever Backend

Este documento contiene los datos cargados mediante el `seed.ts` y los comandos `curl` necesarios para probar los diferentes endpoints de la API.

---

## 📊 Datos Cargados (Seed)

### 👤 Usuarios y Credenciales
*Password base para todos:* `Admin123` (Admins) o conforme a la tabla (Deportistas).

| Rol | Email | Password | DNI |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@club.com` | `Admin123` | 30123456 |
| **ADMINISTRATIVO** | `secretaria@club.com` | `Admin123` | 31234567 |
| **DEPORTISTA** | `juan.perez@mail.com` | `Juan1234` | 40123456 |
| **DEPORTISTA** | `maria.lopez@mail.com` | `Maria1234` | 41234567 |
| **DEPORTISTA** | `pedro.gonzalez@mail.com` | `Pedro1234` | 39876543 |
| **DEPORTISTA** | `ana.martinez@mail.com` | `Ana12345` | 42345678 |

---

## 🔐 Autenticación

### 1. Login Admin
Obtén el token para operaciones administrativas.
```bash
curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@club.com", "password": "Admin123"}'
```

### 2. Login Deportista
Obtén el token para operaciones de usuario.
```bash
curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "juan.perez@mail.com", "password": "Juan1234"}'
```

---

## ⚽ Disciplinas

### Listar Disciplinas
```bash
curl -X GET http://localhost:3000/api/disciplinas \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJhZG1pbkBjbHViLmNvbSIsInJvbCI6IkFETUlOIiwiaWF0IjoxNzcwNTAyMzAzLCJleHAiOjE3NzExMDcxMDN9.RPz3dL08UIR7cHFEbEjOJ_YsYKVUE-u9j_R9gIbSfGk"
```

### Crear Disciplina (Solo Admin)
```bash
curl -X POST http://localhost:3000/api/disciplinas \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJhZG1pbkBjbHViLmNvbSIsInJvbCI6IkFETUlOIiwiaWF0IjoxNzcwNTAyMzAzLCJleHAiOjE3NzExMDcxMDN9.RPz3dL08UIR7cHFEbEjOJ_YsYKVUE-u9j_R9gIbSfGk" \
     -H "Content-Type: application/json" \
     -d '{
       "nombre": "Basquet",
       "descripcion": "Entrenamiento de basquet junior",
       "precioMensual": 12000
     }'
```

---

## 🏃 Deportistas

### Listar todos los Deportistas (Admin)
```bash
curl -X GET http://localhost:3000/api/deportistas \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJhZG1pbkBjbHViLmNvbSIsInJvbCI6IkFETUlOIiwiaWF0IjoxNzcwNTAyMzAzLCJleHAiOjE3NzExMDcxMDN9.RPz3dL08UIR7cHFEbEjOJ_YsYKVUE-u9j_R9gIbSfGk"
```

### Buscar por DNI (Admin)
```bash
curl -X GET "http://localhost:3000/api/deportistas?dni=40123456" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJhZG1pbkBjbHViLmNvbSIsInJvbCI6IkFETUlOIiwiaWF0IjoxNzcwNTAyMzAzLCJleHAiOjE3NzExMDcxMDN9.RPz3dL08UIR7cHFEbEjOJ_YsYKVUE-u9j_R9gIbSfGk"
```

### Ver mi Perfil (Deportista)
```bash
curl -X GET http://localhost:3000/api/deportistas/mi-perfil \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJqdWFuLnBlcmV6QG1haWwuY29tIiwicm9sIjoiREVQT1JUSVNUQSIsImlhdCI6MTc3MDUwMjQ5OCwiZXhwIjoxNzcxMTA3Mjk4fQ.jxhI9W7-iJariNnYuXQWQYDmS-aTwzizg8Ws7ZG6p3s"
```

---

## 💰 Cuotas y Pagos

### Ver mi Estado de Cuenta (Deportista)
```bash
curl -X GET http://localhost:3000/api/cuotas/mi-estado \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJqdWFuLnBlcmV6QG1haWwuY29tIiwicm9sIjoiREVQT1JUSVNUQSIsImlhdCI6MTc3MDUwMjQ5OCwiZXhwIjoxNzcxMTA3Mjk4fQ.jxhI9W7-iJariNnYuXQWQYDmS-aTwzizg8Ws7ZG6p3s"
```

### Generación Mensual de Cuotas (Admin)
```bash
curl -X POST http://localhost:3000/api/cuotas/generar-mensual \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJhZG1pbkBjbHViLmNvbSIsInJvbCI6IkFETUlOIiwiaWF0IjoxNzcwNTAyMzAzLCJleHAiOjE3NzExMDcxMDN9.RPz3dL08UIR7cHFEbEjOJ_YsYKVUE-u9j_R9gIbSfGk" \
     -H "Content-Type: application/json" \
     -d '{"mes": 3, "anio": 2026}'
```

### Ver mis Pagos (Deportista)
```bash
curl -X GET http://localhost:3000/api/pagos/mis-pagos \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJqdWFuLnBlcmV6QG1haWwuY29tIiwicm9sIjoiREVQT1JUSVNUQSIsImlhdCI6MTc3MDUwMjQ5OCwiZXhwIjoxNzcxMTA3Mjk4fQ.jxhI9W7-iJariNnYuXQWQYDmS-aTwzizg8Ws7ZG6p3s"
```

---

## 👨‍👩‍👧‍👦 Grupos Familiares

### Listar Grupos Familiares (Admin)
```bash
curl -X GET http://localhost:3000/api/grupos-familiares \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJhZG1pbkBjbHViLmNvbSIsInJvbCI6IkFETUlOIiwiaWF0IjoxNzcwNTAyMzAzLCJleHAiOjE3NzExMDcxMDN9.RPz3dL08UIR7cHFEbEjOJ_YsYKVUE-u9j_R9gIbSfGk"
```

---

> [!TIP]
> No olvides reemplazar `<TU_TOKEN>`, `<ADMIN_TOKEN>` y `<DEPORTISTA_TOKEN>` con los valores reales obtenidos en el login.
