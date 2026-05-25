# Changelog — Home / Dashboard Mobile (Sprint 003)

**Fecha:** 2026-05-25

## Dependencias agregadas

| Paquete | Uso |
|---------|-----|
| `@react-navigation/bottom-tabs` | Tab bar inferior |
| `@expo/vector-icons` | Íconos Feather/FontAwesome |

## Archivos creados

| Archivo | Descripción |
|---------|-------------|
| `src/constants/theme.ts` | Paleta de colores y gradiente compartidos |
| `src/constants/socialLinks.ts` | URLs WhatsApp e Instagram |
| `src/components/HomeHeader.tsx` | Header gradiente con saludo y logout |
| `src/components/MenuRow.tsx` | Fila del menú con ícono y chevron |
| `src/components/SocialLinkCard.tsx` | Card de red social |
| `src/components/ScreenHeader.tsx` | Header azul reutilizable |
| `src/components/LoadingState.tsx` | Spinner + label de sección |
| `src/navigation/MainTabNavigator.tsx` | Bottom tabs + stacks anidados |
| `src/screens/PaymentHistoryScreen.tsx` | Historial de pagos |
| `src/screens/FamilyGroupScreen.tsx` | Grupo familiar |
| `src/screens/NewsScreen.tsx` | Lista de noticias |
| `src/screens/NewsDetailScreen.tsx` | Detalle de noticia |
| `src/screens/ProfileScreen.tsx` | Mi perfil |
| `src/services/noticiaService.ts` | API noticias |
| `src/types/pago.ts` | Tipos historial de pagos |
| `src/types/noticia.ts` | Tipos noticias |
| `src/utils/formatters.ts` | Formateo moneda, fechas, DNI, iniciales |
| `prompts/003_home_mobile_prompt.md` | Prompt del sprint |
| `prompts/003_home_mobile_plan.md` | Plan resumido |
| `prompts/003_home_mobile_response.md` | Respuesta de implementación |
| `prompts/003_home_mobile_changelog.md` | Este changelog |

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `package.json` / `package-lock.json` | Nuevas dependencias |
| `src/screens/HomeScreen.tsx` | Dashboard completo con menú y redes |
| `src/screens/DebtStatusScreen.tsx` | Back condicional; tipos Pagos stack |
| `src/navigation/AppNavigator.tsx` | Usa `MainTabNavigator` |
| `src/navigation/types.ts` | Param lists con `NavigatorScreenParams` |
| `src/services/deportistaService.ts` | `getMiHistorial()` |
| `src/services/authService.ts` | `updateProfile()` |
| `src/services/grupoFamiliarService.ts` | Tipos extendidos para integrantes |
| `src/types/auth.ts` | Perfil extendido + `UpdateProfileRequest` |
