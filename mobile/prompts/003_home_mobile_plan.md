# Plan — Home / Dashboard Mobile (Sprint 003)

**Fecha:** 2026-05-25

Ver plan detallado en Cursor: `home_dashboard_mobile_1f981e61.plan.md`

## Resumen de fases

### Fase 1 — Home + navegación
- Instalar `@react-navigation/bottom-tabs` y `@expo/vector-icons`
- Crear `constants/theme.ts`, `constants/socialLinks.ts`
- Componentes: `HomeHeader`, `MenuRow`, `SocialLinkCard`, `ScreenHeader`, `LoadingState`
- Refactor `HomeScreen.tsx` según mockup PDF p.2
- `MainTabNavigator` con 4 tabs y stacks anidados

### Fase 2 — Pantallas del menú
- `PaymentHistoryScreen` → `GET /deportistas/mi-historial`
- `FamilyGroupScreen` → `GET /grupos-familiares/mios`
- `NewsScreen` + `NewsDetailScreen` → `GET /noticias`, `GET /noticias/:id`
- `ProfileScreen` → `GET /deportistas/mi-perfil`, `PUT /users/profile`

### Adaptaciones
- `DebtStatusScreen`: back button condicional cuando es raíz del tab Pagos
- Perfil: nombre/DNI/disciplina solo lectura (limitación backend)

## Criterios de aceptación

- [x] Home alineado al PDF
- [x] Menú navegable con tabs
- [x] Datos dinámicos (nombre, disciplina)
- [x] Logout en header
- [x] WhatsApp e Instagram externos
- [x] Pantallas Fase 2 con backend real
- [x] Documentación en `mobile/prompts/`
