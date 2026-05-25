# Respuesta de implementación — Home / Dashboard Mobile (Sprint 003)

**Fecha:** 2026-05-25

## Resumen

Se implementó el dashboard mobile completo según el mockup `mobile/export/export.pdf` (p.2) y el frame `"02 – Inicio"` de `forever-mobile.pen`. El Home pasó de un placeholder con dos botones a un dashboard con header gradiente, menú de 5 items, redes del club y tab bar persistente. Se agregaron las pantallas de Historial de Pagos, Grupo Familiar, Noticias y Mi Perfil, todas conectadas al backend web existente.

## Navegación

- **Inicio** → `HomeScreen` + stack con `FamilyGroupScreen`
- **Pagos** → `DebtStatusScreen` + `PaymentHistoryScreen`
- **Perfil** → `ProfileScreen`

Desde el menú del Home se usa navegación cross-tab (ej. `navigation.navigate('Pagos', { screen: 'DebtStatus' })`).

## UI implementada — Home (PDF p.2)

- Header con gradiente `#002244 → #003366 → #004080`
- Logo FE, saludo `"Hola, {nombre}"`, ícono logout
- `"Bienvenido al club"` + `"Deportista • {disciplina}"` (disciplina desde `mi-perfil`)
- Menú: Estado de deuda, Historial de pagos, Grupo familiar, Noticias del club, Mi perfil
- Redes del club: WhatsApp (`5492211234567`) e Instagram
- Tab bar: Inicio | Pagos | Noticias | Perfil

## Endpoints utilizados

| Método | Ruta | Pantalla |
|--------|------|----------|
| GET | `/deportistas/mi-perfil` | HomeHeader, ProfileScreen |
| GET | `/deportistas/mi-historial` | PaymentHistoryScreen |
| GET | `/grupos-familiares/mios` | FamilyGroupScreen, DebtStatusScreen |
| GET | `/noticias` | NewsScreen |
| GET | `/noticias/:id` | NewsDetailScreen |
| PUT | `/users/profile` | ProfileScreen (email y contraseña) |
| GET | `/cuotas/mi-estado` | DebtStatusScreen (sin cambios de API) |

## Decisiones técnicas

1. **`@expo/vector-icons`** — Feather para íconos del menú y tabs; FontAwesome para Instagram.
2. **`NavigatorScreenParams`** — tipado correcto para navegación anidada tabs → stacks.
3. **Perfil simplificado** — nombre, DNI y disciplina son solo lectura porque `PUT /users/profile` solo acepta email, teléfono y contraseña.
4. **DebtStatus back button** — oculto cuando la pantalla es raíz del tab Pagos (`!navigation.canGoBack()`).
5. **Theme centralizado** — `constants/theme.ts` unifica colores entre pantallas nuevas y existentes.

## Verificación

- `npx tsc --noEmit` en `mobile/` pasa sin errores.

## Pendientes / fuera de alcance

- Integración real con Mercado Pago (sigue como alert placeholder en DebtStatus).
- URL de Instagram real del club (se reutiliza placeholder de la web).
