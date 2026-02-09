# Credenciales de simulación – Panel Admin

El ingreso al sistema es con **DNI y contraseña** (no se usa email).

Para ingresar al **panel de administración** del Club For Ever (frontend), usá estas credenciales en la pantalla de login:

| Campo      | Valor            |
|-----------|------------------|
| **DNI**   | `admin`          |
| **Contraseña** | `admin123` |

- Si ingresás con **DNI: admin** y **admin123**, entrás como **admin** y se redirige al panel de administración (`/admin`).
- Las **cuentas de deportistas** las crea el administrador en **Gestión deportistas**: al crear un deportista se usa el **DNI** y se asigna **contraseña inicial**. El deportista ingresa con DNI y contraseña; puede cambiar la contraseña después desde Mi Perfil. El admin **no puede ver ni editar** la contraseña una vez creada la cuenta.
- Para probar login como deportista (cuentas mock): **DNI** `12345678` / `23456789` / `34567890` con contraseña **`deportista123`**.

## Panel Admin – Secciones

1. **Gestión deportistas** – Crear deportistas y dar de baja / dar de alta.
2. **Gestión cuotas** – Ver cuotas (todas o solo en efectivo) y marcar como pagadas las pagadas en efectivo.
3. **Gestión grupo familiar** – Crear, modificar y borrar grupos familiares.
4. **Gestión admin** – Ver y editar usuarios admin; activar/desactivar.
5. **Gestión disciplinas** – ABM de disciplinas y actualizar el valor mensual de cada una.
6. **Crear noticias** – Publicar noticias (título, fecha, resumen, contenido, imágenes). Las noticias creadas se ven en la sección Noticias del lado deportista.

Los datos son **mock** (en memoria/localStorage según el caso); al recargar la página se mantienen los de los mocks iniciales, salvo noticias que usan contexto compartido.
