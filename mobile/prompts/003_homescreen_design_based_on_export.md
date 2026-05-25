# HomeScreen design based on export
_Exported on 5/25/2026 at 19:39:59 GMT-3 from Cursor (3.5.33)_

---

**User**

@mobile/export/export.pdf necesito que diseñes la @mobile/src/screens/HomeScreen.tsx de la manera que esta en el @mobile/export/export.pdf. Ademas de eso necesito que me des un prompt para armar un plan. 

---

**Cursor**

Revisando el PDF de diseño y la pantalla actual para alinearlas y preparar un prompt de planificación.


Estoy en **modo Ask**, así que no puedo editar código; te dejo la especificación de diseño y un prompt listo para armar el plan de implementación.

---

## Estado actual vs. diseño (`export.pdf`, página 2)

La `HomeScreen` actual es un placeholder mínimo:

```14:38:mobile/src/screens/HomeScreen.tsx
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.greeting}>Hola{greetingName ? `, ${greetingName}` : ''}</Text>
        <Text style={styles.welcome}>Bienvenido al club</Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate('DebtStatus')}
          ...
        >
          <Text style={styles.primaryButtonText}>Estado de deuda</Text>
        </Pressable>

        <Pressable ... onPress={() => void logout()}>
          <Text style={styles.secondaryButtonText}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
```

El mockup pide una pantalla de **dashboard con menú**, no una card centrada con dos botones.

---

## Especificación de diseño — `HomeScreen`

### Layout general

```
┌─────────────────────────────┐
│ Status bar (sistema)        │
├─────────────────────────────┤
│ HEADER (gradiente azul)     │
│  [FE]          Hola, Juan ⎋ │
│  Bienvenido al club         │
│  Deportista • Fútbol        │
├─────────────────────────────┤
│ MENÚ (scroll, fondo #F8F9FA)│
│  ┌ Estado de deuda      ›  │
│  ┌ Historial de pagos  ›  │
│  ┌ Grupo familiar      ›  │
│  ┌ Noticias del club   ›  │
│  ┌ Mi perfil           ›  │
│                             │
│ REDES DEL CLUB              │
│  [WhatsApp]  [Instagram]    │
├─────────────────────────────┤
│ Tab bar: Inicio|Pagos|...   │
└─────────────────────────────┘
```

### 1. Header (gradiente)

Reutilizar el mismo gradiente del login:

- Colores: `#002244` → `#003366` → `#004080`
- Rotación ~135°
- `paddingTop`: safe area (`useSafeAreaInsets`)

**Fila superior (64px):**

| Izquierda | Derecha |
|-----------|---------|
| Círculo blanco 40×40, texto "FE" `#003366` 13px bold | "Hola, Juan" blanco 15px semibold + ícono logout |

**Bloque de bienvenida (debajo):**

- "Bienvenido al club" — blanco, 20px bold
- "Deportista • Fútbol" — `rgba(255,255,255,0.8)`, 13px

**Datos dinámicos:**

- Nombre: `user.nombre` (o `loginId` como fallback)
- Subtítulo: `"Deportista • {disciplina}"` desde `GET /deportistas/mi-perfil` (`disciplina.nombre`)
- Logout: ícono en header (no botón grande en el body)

### 2. Sección Menú

- Label: **"MENÚ"** — `#999999`, 12px, semibold, letter-spacing 1
- 5 filas tipo lista, cada una:
  - Altura: 56px
  - Fondo blanco, border-radius 12px
  - Sombra: `#00336610`, offset y:2, blur 8 (usar `cardShadow` existente)
  - Ícono en contenedor 36×36 con fondo de color
  - Texto 15px medium `#0A0A0A`
  - Chevron `›` a la derecha `#999999`

| Item | Ícono (Lucide) | Fondo ícono | Color ícono | Navegación |
|------|----------------|-------------|-------------|------------|
| Estado de deuda | `credit-card` | `#EEF2FF` | `#003366` | `DebtStatus` (ya existe) |
| Historial de pagos | `receipt` | `#E8F5E9` | `#2E7D32` | Nueva pantalla |
| Grupo familiar | `users` | `#FFF3E0` | `#E65100` | Nueva pantalla |
| Noticias del club | `newspaper` | `#F3E5F5` | `#6A1B9A` | Nueva pantalla |
| Mi perfil | `user` | `#E3F2FD` | `#1565C0` | Nueva pantalla |

Gap entre filas: 12px. Contenedor con `ScrollView` y padding 16px.

### 3. Redes del club

- Label: **"REDES DEL CLUB"** (mismo estilo que "MENÚ")
- Dos cards en fila (`flexDirection: 'row'`, gap 12):
  - WhatsApp: ícono `#25D366` + texto "WhatsApp"
  - Instagram: ícono `#E1306C` + texto "Instagram"
- Altura 52px, fondo blanco, border-radius 12px, sombra suave
- Acción: `Linking.openURL` (WhatsApp: `5492211234567` como en `LoginScreen`; Instagram: URL del club)

### 4. Tab bar inferior

Componente reutilizable visible en todas las pantallas autenticadas:

| Tab | Ícono | Activo | Inactivo |
|-----|-------|--------|----------|
| Inicio | `house` | `#003366` bold | `#999999` |
| Pagos | `credit-card` | idem | idem |
| Noticias | `newspaper` | idem | idem |
| Perfil | `user` | idem | idem |

- Fondo blanco, altura ~83px (incl. safe area bottom)
- Sombra superior: `#00336620`, y:-2
- Label 10px

**Nota arquitectónica:** hoy solo hay `AppStack` con `Home` y `DebtStatus`. Para el tab bar conviene migrar a `@react-navigation/bottom-tabs` (o tabs + stacks anidados). "Pagos" puede apuntar a `DebtStatus` o a un hub de pagos.

### Tokens de color (consistencia)

```typescript
const COLORS = {
  primary: '#003366',
  background: '#F8F9FA',  // mockup (Login usa #F5F7FA — unificar)
  surface: '#FFFFFF',
  text: '#0A0A0A',
  textMuted: '#999999',
  // íconos por fila: ver tabla arriba
};
```

### Componentes sugeridos

```
mobile/src/
  components/
    MenuRow.tsx          // fila reutilizable del menú
    SocialLinkCard.tsx   // WhatsApp / Instagram
    AppTabBar.tsx        // bottom tabs
    HomeHeader.tsx       // gradiente + saludo
  constants/
    theme.ts             // COLORS compartidos
    socialLinks.ts       // URLs WhatsApp/Instagram
  navigation/
    MainTabNavigator.tsx // tabs + stacks
```

---

## APIs y dependencias

| Dato | Endpoint | Estado en mobile |
|------|----------|----------------|
| Nombre | `AuthContext.user` | ✅ |
| Disciplina | `GET /deportistas/mi-perfil` | ⚠️ servicio existe, falta usar en Home |
| Estado deuda | `GET /cuotas/mi-estado` | ✅ (`DebtStatusScreen`) |
| Historial | `GET /deportistas/mi-historial` | ❌ falta servicio |
| Grupo familiar | `GET /grupos-familiares/mios` | ✅ parcial |
| Noticias | `GET /noticias` | ❌ falta servicio |
| Perfil editable | `GET/PUT /deportistas/mi-perfil` | ❌ falta pantalla |

**Dependencia nueva probable:** íconos (`@expo/vector-icons` con Lucide, o similar). El mockup usa Lucide; el proyecto mobile aún no lo tiene.

---

## Prompt para armar el plan

Copiá y pegá esto en Agent mode (o en un nuevo chat de planificación):

---

```markdown
# Prompt — Home / Dashboard Mobile (Sprint 003)

**Fecha:** 2026-05-25
**Usuario:** [tu email]

## Prompt textual

> Necesito que rediseñes e implementes la pantalla Home (`mobile/src/screens/HomeScreen.tsx`) siguiendo el mockup de `mobile/export/export.pdf` (página 2 — "Inicio") y el diseño en `mobile/forever-mobile.pen` (frame "02 – Inicio"). Solo modificar archivos dentro de `mobile/`. Reutilizar el backend existente del proyecto web. Seguir la estructura y convenciones ya establecidas en los sprints 001 (Login) y 002 (Estado de Deuda). Documentar en `mobile/prompts/` con prompt, plan, respuesta y changelog.

## Objetivo

Transformar el Home actual (placeholder con 2 botones) en un dashboard completo con:
- Header con gradiente azul, logo FE, saludo personalizado, logout en header
- Subtítulo "Bienvenido al club" + chip "Deportista • {disciplina}"
- Lista de menú con 5 items navegables (Estado de deuda, Historial de pagos, Grupo familiar, Noticias del club, Mi perfil)
- Sección "Redes del club" (WhatsApp + Instagram)
- Tab bar inferior persistente: Inicio | Pagos | Noticias | Perfil

## Referencias de diseño

- PDF: `mobile/export/export.pdf` — página 2
- Pencil: `mobile/forever-mobile.pen` — frame "02 – Inicio"
- Paleta: `#003366`, gradiente `#002244 → #003366 → #004080`, fondo `#F8F9FA`
- Patrones existentes: `LoginScreen.tsx`, `DebtStatusScreen.tsx`, `cardShadow.ts`

## Alcance técnico

### Home + navegación (MVP)
1. Crear componentes: `HomeHeader`, `MenuRow`, `SocialLinkCard`, `AppTabBar`
2. Refactorizar `HomeScreen.tsx` según spec del mockup
3. Migrar navegación a bottom tabs (`@react-navigation/bottom-tabs`):
   - Tab Inicio → HomeScreen
   - Tab Pagos → DebtStatusScreen (o stack de pagos)
   - Tab Noticias → placeholder o NoticiasScreen
   - Tab Perfil → placeholder o ProfileScreen
4. Cargar disciplina vía `deportistaService.getMiPerfil()` para el subtítulo
5. WhatsApp: reutilizar `5492211234567` de LoginScreen
6. Extraer `COLORS` compartidos a `constants/theme.ts`

### Servicios a crear/extender
- `deportistaService.getMiHistorial()`
- `noticiaService.getAll()` / `getById()`
- Extender tipos en `mobile/src/types/`

## Restricciones

- Solo tocar `mobile/`
- No modificar backend ni frontend web
- Mantener TypeScript estricto
- Accesibilidad: `accessibilityRole`, `accessibilityLabel` en botones
- Safe area en header y tab bar
- Documentar en `mobile/prompts/003_home_mobile_*.md`

## Criterios de aceptación

- [ ] Home visualmente alineado al PDF (header, menú, redes, tabs)
- [ ] "Estado de deuda" navega a pantalla existente
- [ ] Nombre del usuario y disciplina son dinámicos
- [ ] Logout accesible desde header (ícono)
- [ ] Tab bar visible en pantallas autenticadas
- [ ] WhatsApp e Instagram abren links externos
- [ ] Sin regresiones en Login y DebtStatus

## Entregables de documentación

- `mobile/prompts/003_home_mobile_prompt.md` — este prompt
- `mobile/prompts/003_home_mobile_plan.md` — plan detallado por tareas
- `mobile/prompts/003_home_mobile_response.md` — resumen de implementación
- `mobile/prompts/003_home_mobile_changelog.md` — archivos tocados
```

---

## Recomendación de orden de trabajo

1. **Navegación (tabs)** — base para el tab bar del mockup  
2. **Home UI** — header + menú + redes  
3. **Pantallas faltantes** — Historial, Noticias, Perfil, Grupo familiar (una por sprint o en paralelo)

Si querés que lo implemente directamente, cambiá a **Agent mode** y pegá el prompt de arriba (o pedime que arranque con la Fase 1).

---

**User**

# Prompt — Home / Dashboard Mobile (Sprint 003)

**Fecha:** 2026-05-25
**Usuario:** [tu email]

## Prompt textual

> Necesito que rediseñes e implementes la pantalla Home (`mobile/src/screens/HomeScreen.tsx`) siguiendo el mockup de `mobile/export/export.pdf` (página 2 — "Inicio") y el diseño en `mobile/forever-mobile.pen` (frame "02 – Inicio"). Solo modificar archivos dentro de `mobile/`. Reutilizar el backend existente del proyecto web. Seguir la estructura y convenciones ya establecidas en los sprints 001 (Login) y 002 (Estado de Deuda). Documentar en `mobile/prompts/` con prompt, plan, respuesta y changelog.

## Objetivo

Transformar el Home actual (placeholder con 2 botones) en un dashboard completo con:
- Header con gradiente azul, logo FE, saludo personalizado, logout en header
- Subtítulo "Bienvenido al club" + chip "Deportista • {disciplina}"
- Lista de menú con 5 items navegables (Estado de deuda, Historial de pagos, Grupo familiar, Noticias del club, Mi perfil)
- Sección "Redes del club" (WhatsApp + Instagram)
- Tab bar inferior persistente: Inicio | Pagos | Noticias | Perfil

## Referencias de diseño

- PDF: `mobile/export/export.pdf` — página 2
- Pencil: `mobile/forever-mobile.pen` — frame "02 – Inicio"
- Paleta: `#003366`, gradiente `#002244 → #003366 → #004080`, fondo `#F8F9FA`
- Patrones existentes: `LoginScreen.tsx`, `DebtStatusScreen.tsx`, `cardShadow.ts`

## Alcance técnico

### Home + navegación (MVP)
1. Crear componentes: `HomeHeader`, `MenuRow`, `SocialLinkCard`, `AppTabBar`
2. Refactorizar `HomeScreen.tsx` según spec del mockup
3. Migrar navegación a bottom tabs (`@react-navigation/bottom-tabs`):
   - Tab Inicio → HomeScreen
   - Tab Pagos → DebtStatusScreen (o stack de pagos)
   - Tab Noticias → placeholder o NoticiasScreen
   - Tab Perfil → placeholder o ProfileScreen
4. Cargar disciplina vía `deportistaService.getMiPerfil()` para el subtítulo
5. WhatsApp: reutilizar `5492211234567` de LoginScreen
6. Extraer `COLORS` compartidos a `constants/theme.ts`


### Servicios a crear/extender
- `deportistaService.getMiHistorial()`
- `noticiaService.getAll()` / `getById()`
- Extender tipos en `mobile/src/types/`

## Restricciones

- Solo tocar `mobile/`
- No modificar backend ni frontend web
- Mantener TypeScript estricto
- Accesibilidad: `accessibilityRole`, `accessibilityLabel` en botones
- Safe area en header y tab bar
- Documentar en `mobile/prompts/003_home_mobile_*.md`

## Criterios de aceptación

- [ ] Home visualmente alineado al PDF (header, menú, redes, tabs)
- [ ] "Estado de deuda" navega a pantalla existente
- [ ] Nombre del usuario y disciplina son dinámicos
- [ ] Logout accesible desde header (ícono)
- [ ] Tab bar visible en pantallas autenticadas
- [ ] WhatsApp e Instagram abren links externos
- [ ] Sin regresiones en Login y DebtStatus

## Entregables de documentación

- `mobile/prompts/003_home_mobile_prompt.md` — este prompt
- `mobile/prompts/003_home_mobile_plan.md` — plan detallado por tareas
- `mobile/prompts/003_home_mobile_response.md` — resumen de implementación
- `mobile/prompts/003_home_mobile_changelog.md` — archivos tocados

---

**Cursor**

Revisando el proyecto mobile y las referencias del frontend para armar un plan concreto del Sprint 003.


Tengo el contexto necesario. Creando el plan detallado del Sprint 003.


---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Implementando el Sprint 003 según el plan: empiezo por dependencias y constantes de tema.


Creando las pantallas y refactorizando HomeScreen y DebtStatusScreen.


Actualizando DebtStatusScreen y verificando la compilación TypeScript.


Sprint 003 implementado. Resumen:

## Qué se hizo

**Home rediseñado** según el PDF p.2:
- Header con gradiente, logo FE, saludo dinámico, logout en header
- `"Deportista • {disciplina}"` desde `GET /deportistas/mi-perfil`
- Menú con 5 items navegables
- Sección "Redes del club" (WhatsApp + Instagram)

**Navegación por tabs** (`MainTabNavigator`):
- **Inicio** → Home + Grupo Familiar
- **Pagos** → Estado de Deuda + Historial
- **Noticias** → Lista + Detalle
- **Perfil** → Mi Perfil

**Componentes reutilizables:** `HomeHeader`, `MenuRow`, `SocialLinkCard`, `ScreenHeader`, `LoadingState`

**Dependencias:** `@react-navigation/bottom-tabs`, `@expo/vector-icons`

**DebtStatus:** el botón volver solo aparece si `navigation.canGoBack()` es true (oculto cuando es raíz del tab Pagos).

## Verificación

- `npx tsc --noEmit` pasa sin errores
- Documentación en `mobile/prompts/003_home_mobile_*.md`

Para probar: `npm start` en `mobile/` y loguearte como deportista.

---

**User**

Necesito que no implementes las pantallas de perfil, historial de pagos y noticias

---

**Cursor**

Revisando el estado actual para quitar Perfil, Historial de pagos y Noticias, manteniendo el Home y la navegación principal.


Eliminando las pantallas de Perfil, Historial y Noticias; manteniendo Home, Grupo Familiar y Estado de Deuda, con avisos "Próximamente" en el menú para lo no implementado.


