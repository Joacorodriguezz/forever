# Entrega 2 documentación del proyecto móvil
_Exported on 6/23/2026 at 20:10:43 GMT-3 from Cursor (3.6.21)_

---

**User**

Entrega 2 — Escalado Funcional

Necesito generar la documentación para la Entrega 2 de un proyecto móvil.
El app es una app de gestión familiar con historial de pagos, grupo familiar y noticias.
El diseño está en: mobile/forever-mobile.pen

Por favor genera:

1. **alcance_e2.pdf**: 
   - Changelog del alcance: nuevos RF (numerados RF-XX), RF modificados de E1, RF pospuestos a E3
   - Nuevas User Stories (mínimo 4) con formato: "Como [rol] quiero [acción] para [beneficio]"
   - Criterios de aceptación completos (Given/When/Then) para cada US
   - Gestión de excepciones y validaciones nuevas (conflictos, duplicados, permisos, etc.)
   - Reglas de negocio explícitas para historial de pagos, grupo familiar y noticias

2. **doc_tecnica_e2.pdf**:
   - Autenticación/autorización: sistema de login, roles (admin familiar, miembro, invitado), permisos por pantalla
   - Integración con backend/servicios externos: endpoints REST, métodos, rutas, request/response
   - Estructura de base de datos en tiempo real (Firestore o similar) si aplica
   - Manejo de errores de red y estrategia de retry
   - Decisiones de refactoring desde E1 (qué cambió, por qué)
   - Deuda técnica documentada y plan para resolverla en E3

3. **Figma E2** (para revisar):
   - Nuevas pantallas para historial de pagos, grupo familiar, noticias
   - Todos los estados (carga, error, vacío, datos)
   - Consideraciones de accesibilidad (contraste WCAG AA, tamaño fuente 14sp mín, áreas táctiles 48x48dp)

Basate en el diseño de Penpot para flujos y pantallas.
Formato: Markdown legible que pueda convertirse a PDF. 
Tono: profesional, técnico, documentación.

---

**Cursor**

Explorando el proyecto y el diseño Penpot para generar la documentación de la Entrega 2 con base real en el código y los flujos definidos.


Creando los tres documentos Markdown en `docs/`, alineados con el diseño Penpot y el código del proyecto.


Se generaron tres documentos Markdown en `docs/`, listos para convertir a PDF. Están alineados con el diseño Penpot (`mobile/forever-mobile.pen`), el backend existente y el estado actual del código mobile.

## Archivos creados

| Documento solicitado | Archivo | Contenido |
|---------------------|---------|-----------|
| **alcance_e2.pdf** | [`docs/alcance_e2.md`](docs/alcance_e2.md) | Changelog RF-12 a RF-18, modificaciones RF-05/08/10, pospuestos E3, 5 User Stories con Given/When/Then, excepciones/validaciones, reglas de negocio |
| **doc_tecnica_e2.pdf** | [`docs/doc_tecnica_e2.md`](docs/doc_tecnica_e2.md) | Auth JWT, roles, permisos por pantalla, endpoints REST, esquema PostgreSQL (no Firestore), retry/errores de red, refactoring E1→E2, deuda técnica TD-01 a TD-10 |
| **Figma E2** | [`docs/figma_e2.md`](docs/figma_e2.md) | Spec visual de pantallas 04/05/07 Penpot, estados carga/error/vacío/datos, accesibilidad WCAG AA, checklist de revisión |

## Decisiones clave documentadas

- **E2 escala** historial (filtros), grupo familiar (solo lectura) y noticias (listado + detalle).
- **RF-05** pasa de una cuota a varias (`cuotaIds[]`), según el addendum E1.
- **Roles:** backend usa `DEPORTISTA` / `ADMIN` / `ADMINISTRATIVO`; en UI familiar se documentan Titular / Miembro / Sin grupo. *Invitado* queda pospuesto a E3.
- **Base de datos:** PostgreSQL vía Prisma; no hay tiempo real/Firestore en E2.
- **Estado actual del código:** historial ya implementado; grupo familiar y noticias siguen como *Coming Soon* — la documentación describe el objetivo E2.

## Convertir a PDF

Con Pandoc instalado:

```powershell
cd "c:\Users\CEI\Documents\Luca\4to\AppsMoviles\forever\docs"
pandoc alcance_e2.md -o alcance_e2.pdf
pandoc doc_tecnica_e2.md -o doc_tecnica_e2.pdf
pandoc figma_e2.md -o figma_e2.pdf
```

También podés usar *Print to PDF* desde VS Code/Cursor con vista previa Markdown.

Si querés, en un siguiente paso puedo generar los PDF directamente o ajustar el alcance (por ejemplo, excluir RF-16 pago múltiple si no va en esta entrega).

---

**User**

creamelos como pdf por favor

---

**Cursor**

Comprobando si hay herramientas disponibles para convertir los Markdown a PDF.


---

**User**

podes generarlos en pdf por favor? tanto el alcance como la doc tecnica

---

**Cursor**

Generando los PDF con una herramienta local; primero verifico qué hay disponible en el entorno.


Listo. Los PDF quedaron generados en `docs/`:

| Archivo | Ruta |
|---------|------|
| **Alcance E2** | `docs/alcance_e2.pdf` (~274 KB) |
| **Doc. técnica E2** | `docs/doc_tecnica_e2.pdf` (~328 KB) |

Se generaron a partir de los Markdown con `md-to-pdf` (formato A4, márgenes 20 mm). Podés abrirlos directamente desde el explorador de archivos del proyecto.

Si también querés el de diseño (`figma_e2.pdf`), decime y lo genero.

---

**User**

entonces los md se borran y me quedo solo con los pdf no?

---

**Cursor**

No necesariamente. Lo habitual es **quedarte con ambos**, cada uno con un rol distinto:

| Archivo | Para qué sirve |
|---------|----------------|
| **`.md`** | Fuente editable: si hay que corregir algo, cambiás el Markdown y regenerás el PDF en segundos. |
| **`.pdf`** | Entrega formal: lo que subís o entregás a los profesores. |

Si borrás los `.md`:
- Perdés la versión fácil de editar.
- Cualquier cambio futuro implica retocar el PDF a mano o reescribir todo.

**Recomendación:** conservá `alcance_e2.md` y `doc_tecnica_e2.md` en el repo (o en backup) y usá los `.pdf` solo para la entrega.

Si la entrega pide **exclusivamente PDF** y no querés los Markdown en el proyecto, podés borrarlos; no es obligatorio para que los PDF sigan siendo válidos.

¿Querés que borre los `.md` de E2 del repo, o preferís dejarlos como respaldo?

---

**User**

podria subir solo los pdf y quedarme los md por si hay que hacer cambios

---

**Cursor**

Sí, es una buena estrategia.

**Para la entrega / repo público:** subí solo `alcance_e2.pdf` y `doc_tecnica_e2.pdf`.

**Para vos / el equipo:** guardá los `.md` en el repo privado, en otra carpeta local o en backup. Cuando haya cambios, editás el Markdown y regenerás el PDF.

Solo tené en cuenta:

- Si los `.md` **no** están en git, hacé backup en otro lado (Drive, repo privado, etc.) para no perder la fuente editable.
- Si **sí** los subís al repo pero no querés que “compitan” con el PDF en la entrega, podés dejarlos en una rama de desarrollo o ignorarlos con `.gitignore` — aunque lo más simple suele ser tener ambos en el repo: PDF para entregar y MD para mantener.

En resumen: **PDF para entregar, MD para editar** es exactamente lo correcto.

---

**User**

por que el doc tecnica dice esto: The file is not displayed in the text editor because it is either binary or uses an unsupported text encoding.

---

**Cursor**

Eso es **normal**. No significa que el PDF esté roto.

## Por qué pasa

`doc_tecnica_e2.pdf` es un archivo **binario** (formato PDF), no texto plano como un `.md` o `.txt`.

Cursor/VS Code está intentando abrirlo en el **editor de texto**, y ese editor solo sirve para archivos de texto. Por eso muestra:

> *The file is not displayed in the text editor because it is either binary or uses an unsupported text encoding.*

Lo de “11546 líneas” que ves a veces en la pestaña es el editor interpretando bytes del PDF como si fueran texto; no es el documento legible.

## Cómo verlo bien

- **Clic derecho → Reveal in File Explorer → doble clic** → se abre con el visor de PDF de Windows (Edge, Adobe, etc.).
- O en Cursor: **clic derecho → Open With…** y elegí un visor de PDF si tenés extensión instalada.

## Resumen

| Archivo | Abrilo con |
|---------|------------|
| `.md` | Editor de texto de Cursor |
| `.pdf` | Visor de PDF (no el editor de texto) |

Para editar el contenido seguí usando `doc_tecnica_e2.md`; el `.pdf` es solo la versión final para entregar.

---

**User**

hay ciertas cosas a cambiar te voy diciendo en alcance-e2: RF-16 no va, lo de 2.2 de RF-05 es al reves, en 2.3 ABM grupo familiar mobile no va y la edicion es solo datos del deportista, lo de Internacionalizacion chau. en US-E2-04 fijate que en realidad se paga cuota a cuota no se pueden agarrar varias. US-E2-05 sacalo. fijate de aplicar todos estos cambios de manera que sea consistente

---

**Cursor**

Revisando los documentos para aplicar los cambios de forma consistente.


Aplicando los cambios en ambos Markdown y regenerando los PDF.


Listo. Apliqué los cambios de forma consistente en `alcance_e2.md`, `doc_tecnica_e2.md` y regeneré ambos PDF.

## Resumen de cambios

### Alcance (`alcance_e2.md` / `.pdf`)

| Tema | Antes | Ahora |
|------|-------|-------|
| **RF-16** (pago múltiple) | Nuevo RF E2 | Eliminado |
| **RF-17 / RF-18** | Estados y accesibilidad | Renumerados a **RF-16** y **RF-17** |
| **RF-05 en §2.2** | E2 pasa a varias cuotas | **Sin cambio**: una cuota por transacción (E1) |
| **RF-05 pago múltiple** | — | Pospuesto a **E3** (§2.3) |
| **§2.3 ABM grupo** | Pospuesto E3 | Eliminado (fuera de alcance mobile) |
| **§2.3 Edición** | “Edición de perfil mobile” | **Edición de datos del deportista** (teléfonos, obra social, etc.) → E3 |
| **§2.3 i18n** | Pospuesto E3 | Eliminado |
| **US-E2-04** | Pagar varias cuotas | Eliminada |
| **US-E2-05** | Errores de red transversal | Eliminada |
| **§4.4 pago múltiple** | Validaciones RF-16 | Eliminada |
| **§5.4** | — | Nueva regla: pago **cuota por cuota** |
| **§6 Fuera de alcance** | — | Incluye explícitamente ABM grupo, edición deportista y pago múltiple |

Quedan **3 User Stories**: US-E2-01 (grupo), US-E2-02 (noticias), US-E2-03 (historial).

### Doc. técnica (`doc_tecnica_e2.md` / `.pdf`)

- Eliminada la sección de pago múltiple / `cuotaIds[]`.
- `POST /pagos/crear` documentado **sin cambios E2** (una cuota).
- Tabla de refactoring y deuda técnica alineadas con E1 + pospuesto E3.

Los PDF actualizados están en `docs/alcance_e2.pdf` y `docs/doc_tecnica_e2.pdf`. Si tenés más correcciones, seguimos.

---

**User**

te puedo pedir tambien que en documentacion tecnica sea mas simple y no haya codigo?

---

**Cursor**

Revisando la documentación técnica para simplificarla y quitar bloques de código.


Listo. Simplifiqué `doc_tecnica_e2.md` y regeneré `doc_tecnica_e2.pdf`.

## Qué cambió

- **Sin bloques de código** (JSON, TypeScript, Prisma, diagramas ASCII, árbol de carpetas).
- **Lenguaje más directo**, orientado a describir *qué hace* la app y *cómo se integra*, no a mostrar implementación.
- **Tablas** para endpoints, roles, permisos, errores y deuda técnica.
- **Misma información esencial**: arquitectura, auth, API E2, datos, navegación, errores de red, cambios E1→E2 y plan E3.

El PDF actualizado está en `docs/doc_tecnica_e2.pdf`. El Markdown fuente quedó en `docs/doc_tecnica_e2.md` por si querés seguir editando.

¿Querés que aplique el mismo criterio (más simple, sin código) al documento de alcance también?

---

**User**

me corrigieron esto:Luca, disculpa que en el anterior commit no pude revisarlo desde aqui y tuve que mergear. Revisando este fix en terminos generales esta perfecto salvo una cosa, en el documento de alcance aparece como pospuesto el RF de pasar de cuotas simples a cuotas multiples y la idea es mantenerse con la postura de cuotas simples. Modifica eso por favor

---

**Cursor**

Revisando y corrigiendo las referencias al pago múltiple en los documentos de alcance y técnica.


Corregido. La postura queda clara: **cuotas simples**, sin pago múltiple pospuesto a E3.

## Cambios en `alcance_e2.md` / `.pdf`

- **§2.2 RF-05:** se indica postura de producto (cuotas simples; no se prevé pago múltiple).
- **§2.3:** eliminada la fila *RF-05 (pago múltiple)* de pospuestos a E3.
- **§5.4:** el punto 4 dice que el pago múltiple **no está contemplado**, no que se pospone.
- **§6 Fuera de alcance:** aclarado como *no contemplado*, no como backlog.

## Alineación extra

- **`doc_tecnica_e2.md` / `.pdf`:** mismo criterio; eliminado TD-01 de pago múltiple.
- **`addendum_alcance_rf05.md`:** ya no dice que el pago múltiple iba a E2.

PDFs regenerados en `docs/alcance_e2.pdf` y `docs/doc_tecnica_e2.pdf`.

---

**User**

implementame lo que esta en .cursor/plans/e2_mobile_modules_0db7528d.plan.md

---

**Cursor**

Implementando los módulos E2 según el plan: creando utilidades, pantallas y actualizando navegación y backend.


Implementé el plan E2 completo. Resumen:

## Mobile — archivos nuevos

| Archivo | Función |
|---------|---------|
| `components/ScreenState.tsx` | Estados vacío/error con botón Reintentar |
| `utils/resolveImageUrl.ts` | URLs absolutas para imágenes del backend |
| `types/noticia.ts` | Tipo `Noticia` |
| `services/noticiaService.ts` | `GET /noticias` y `GET /noticias/:id` |
| `screens/FamilyGroupScreen.tsx` | RF-12: consulta de grupo familiar |
| `screens/NewsListScreen.tsx` | RF-13: listado de noticias |
| `screens/NewsDetailScreen.tsx` | RF-14: detalle de noticia |

## Mobile — archivos modificados

- **`PaymentHistoryScreen`**: filtro por estado, error/retry, pull-to-refresh, mensajes vacíos diferenciados, sección "OPERACIONES", orden por año/mes descendente.
- **`HomeScreen`**: Grupo familiar → `FamilyGroup`; Noticias → tab Noticias.
- **`AppNavigator` + `types`**: rutas `FamilyGroup`, `NewsDetail`; tab Noticias usa `NewsListScreen`.
- **`grupoFamiliarService`**: tipos extendidos con nombre, categoría, etc.

## Backend

- **`grupoFamiliar.service.ts`**: include de `categoria` en `getByDeportistaId` y `getById`.

## Comportamiento E2

- **Historial**: chips año + estado, deduplicación, tap → detalle de pago.
- **Grupo familiar**: titular/miembro, disciplina, categoría, vacío/error/retry, aviso al pie.
- **Noticias**: tarjetas con imagen o placeholder, detalle con párrafos, 404 manejado.

**Sin tocar:** login, pago, `DebtStatusScreen`, panel web.

Para probar: backend levantado y `EXPO_PUBLIC_API_URL` en `mobile/.env`, luego `npm start` en `mobile/`.


