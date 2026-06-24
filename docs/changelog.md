# Changelog — Entrega 2 (E2)

**Proyecto:** App móvil Club Social y Deportivo For Ever  
**Versión:** 2.0  
**Fecha:** Junio 2026  
**Referencia E1:** rama `main` (commit `089ae07`)  
**Referencia E2:** rama `entrega-2` (commit `2809323`)

---

## Resumen

La Entrega 2 extiende la app móvil implementada en E1 con tres módulos funcionales: **grupo familiar**, **noticias del club** e **historial de pagos mejorado**. El flujo de pago con Mercado Pago se mantiene sin cambios (una cuota por transacción).

| Área | E1 | E2 |
|------|----|----|
| Tab Noticias | Placeholder (`ComingSoonScreen`) | Listado y detalle funcionales |
| Grupo familiar | Placeholder en menú de Inicio | Pantalla de consulta (solo lectura) |
| Historial de pagos | Listado con filtro por año y deduplicación | + filtro por estado, estados UI, pull-to-refresh |
| Pago de cuotas | Una cuota por operación | Sin cambio |
| Backend noticias / grupos | API existente (panel web) | Ajustes de modelo y seeds para mobile |

---

## Agregado en E2

### Mobile — nuevas pantallas y módulos

| Requerimiento | Descripción | Archivos principales |
|---------------|-------------|----------------------|
| **RF-12** | Consulta de grupo familiar: nombre del grupo, cantidad de integrantes, listado con rol Titular/Miembro, disciplina y categoría. Solo lectura. | `mobile/src/screens/FamilyGroupScreen.tsx` |
| **RF-13** | Listado de noticias en tab *Noticias* y acceso desde Inicio. Tarjetas con imagen, fecha (`es-AR`), título y resumen. | `mobile/src/screens/NewsListScreen.tsx` |
| **RF-14** | Detalle de noticia: título, fecha, autor (si existe), contenido y galería de imágenes. | `mobile/src/screens/NewsDetailScreen.tsx` |
| **RF-16** | Componente reutilizable para estados vacío y error con botón *Reintentar*. | `mobile/src/components/ScreenState.tsx` |

**Servicios y utilidades nuevos:**

- `mobile/src/services/noticiaService.ts` — `GET /noticias` y `GET /noticias/:id`
- `mobile/src/types/noticia.ts` — tipos de noticia
- `mobile/src/utils/resolveImageUrl.ts` — resolución de URLs de imágenes

**Navegación:**

- Tab *Noticias* reemplaza `ComingSoonScreen` por `NewsListScreen`
- Rutas de stack nuevas: `FamilyGroup`, `NewsDetail`
- Desde Inicio, *Grupo familiar* y *Noticias del club* navegan a pantallas reales (antes mostraban “próximamente”)

### Backend — datos de prueba y scripts

Scripts npm agregados en `backend/package.json`:

| Script | Propósito |
|--------|-----------|
| `prisma:seed:grupo-familiar` | Grupo familiar de prueba (DNIs 46415236 / 45913162) |
| `prisma:seed:cuotas-deuda` | Cuotas pendientes/vencidas para pruebas de deuda |
| `prisma:seed:noticias` | Dos noticias alineadas al diseño Penpot |

Archivos de seed:

- `backend/prisma/seed-grupo-familiar-46415236-45913162.ts`
- `backend/prisma/seed-cuotas-deuda-46415236.ts`
- `backend/prisma/seed-noticias.ts`
- `backend/prisma/fix-grupo-familiar-schema.sql` — columnas faltantes en entornos desactualizados

### Documentación

- `docs/alcance_e2.md` / `docs/alcance_e2.pdf` — alcance, user stories y reglas de negocio E2
- `docs/doc_tecnica_e2.md` / `docs/doc_tecnica_e2.pdf` — arquitectura, endpoints y deuda técnica
- Actualización de `docs/addendum_alcance_rf05.md` — confirma modelo de cuota simple (una por transacción) como decisión definitiva de producto

---

## Modificado en E2

### Mobile — historial de pagos (RF-08 / RF-15)

La pantalla ya existía en E1 con listado, chips de año, badges de estado y deduplicación por período. E2 la extiende con:

- **Filtro por estado** con chips: Todos / Aprobada / Rechazada / Pendiente
- **Estados de pantalla:** carga, error de red (`ScreenState`), vacío diferenciado (*“No hay pagos registrados”* vs *“No hay pagos para los filtros seleccionados”*)
- **Pull-to-refresh** para recargar el historial
- **Ordenamiento** explícito por año y mes de cuota (descendente)
- **Alineación visual** con pantalla *04 – Historial de Pagos* del diseño Penpot (sección “OPERACIONES”, tipografía 14sp, áreas táctiles ampliadas)

Archivo: `mobile/src/screens/PaymentHistoryScreen.tsx`

### Mobile — accesibilidad (RF-17)

En pantallas E2 y historial extendido:

- Tipografía mínima 14sp en textos principales
- Botones de retroceso y *Reintentar* con área táctil ≥ 48×48 dp
- Contraste acorde al diseño institucional (#003366 sobre fondos claros)

### Mobile — servicio de grupo familiar

- Tipos ampliados para incluir `categoria` del deportista integrante
- Archivo: `mobile/src/services/grupoFamiliarService.ts`

### Backend — modelo y API de grupo familiar

- El endpoint `GET /grupos-familiares/mios` ahora incluye `categoria` de cada deportista integrante (además de `disciplina`)
- Eliminado el enum `Vinculo` (Padre, Madre, Hijo, etc.) del schema Prisma; el rol en mobile se simplifica a **Titular** / **Miembro** según `titularDni` o `esPrincipal`
- Migración: `backend/prisma/migrations/.../migration.sql`
- Ajustes en `grupoFamiliar.service.ts`, validadores, tests y panel admin (`AdminGruposFamiliares.tsx`)

### Backend — seed principal

- `backend/prisma/seed.ts` integra datos de grupo familiar y noticias en el seed global

---

## Sin cambios respecto a E1

Estos módulos de E1 se reutilizan en E2 sin modificación funcional:

| Requerimiento | Funcionalidad |
|---------------|---------------|
| **RF-01** | Login con DNI y contraseña, sesión JWT en SecureStore |
| **RF-02** | Perfil del deportista (tab *Perfil*) |
| **RF-03 / RF-04** | Estado de deuda con cuotas pendientes/vencidas |
| **RF-05** | Selección de **una cuota** por transacción de Mercado Pago |
| **RF-06 / RF-07** | Checkout Mercado Pago y pantalla de resultado (deep link `forever://`) |
| **RF-09** | Detalle de pago con apertura de `linkComprobante` en navegador |
| **RF-10** | Avisos in-app en Home (banner de cuotas pendientes/vencidas) |
| **RF-11** | Cierre de sesión con invalidación de token local |

---

## Pospuesto a E3

| Tema | Motivo |
|------|--------|
| Notificaciones push (FCM/APNs) | Requiere infraestructura de push y registro de dispositivos |
| Descarga offline de comprobante PDF | E2 mantiene apertura de enlace en navegador |
| Edición de datos del deportista desde mobile | Fuera del foco E2 |
| Rol Invitado autenticado | No existe en el modelo de roles actual |
| Sincronización en tiempo real | E2 usa REST + refresh al entrar en pantalla |
| Deep links a WhatsApp e Instagram del club | Placeholders en Home (`showComingSoon`) |
| Pago de varias cuotas en una transacción | Decisión de producto: cuotas simples (ver addendum RF-05) |

---

## Commits de la Entrega 2

```
2809323 E2 - FINALIZADA
9deee77 fix(entrega-2): corrige seed de grupo familiar
1625c87 fix(entrega-2): agrega seed de grupo familiar
87b0cb3 feat(entrega-2): implementa entrega 2
92e5f99 feat(plan): agrega plan de implementacion de e2
5325084 fix(docs): descarta pagos multiples para el futuro
807b273 fix(docs): detalla el pago como simple y no multiple
bd75046 docs(entrega-2): se agregan documentos de alcance y documentacion tecnica para la entrega 2
```

---

## Referencias

- Alcance E2: [`docs/alcance_e2.md`](alcance_e2.md)
- Documentación técnica E2: [`docs/doc_tecnica_e2.md`](doc_tecnica_e2.md)
- Addendum RF-05: [`docs/addendum_alcance_rf05.md`](addendum_alcance_rf05.md)
- Diseño Penpot: `mobile/forever-mobile.pen`

---

*Fin del changelog E2*
