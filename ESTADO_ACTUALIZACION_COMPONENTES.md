# Actualización de Componentes Usuario - Frontend con Backend Real

## Resumen
Los componentes del usuario (deportista) están usando datos mock y necesitan conectarse al backend para mostrar información real.

## Endpoints Backend que ya existen:
- ✅ `GET /api/deportistas/mi-perfil` - Obtener perfil del deportista
- ✅ `GET /api/deportistas/mi-historial` - Obtener historial de pagos
- ❌ `GET /api/cuotas/pendientes` - Obtener cuotas pendientes (FALTA CREAR)
- ❌ `GET /api/grupos-familiares/mi-grupo` - Obtener grupo familiar del deportista (FALTA CREAR)

## Componentes a actualizar:

### 1. ProfileEdit.tsx ✅ ACTUALIZADO
- **Estado**: Ya actualizado para usar `deportistaService.getMiPerfil()`
- **Muestra**: Datos personales, clasificación deportiva, adulto responsable
- **Restricción**: Todos los campos son de solo lectura (cargados por admin)

### 2. DebtStatus.tsx ⏳ PENDIENTE
- **Requiere**: Endpoint nuevo `GET /api/cuotas/pendientes`
- **Debe mostrar**: 
  - Cuotas pendientes del deportista
  - Total adeudado
  - Botón de pago solo si es titular del grupo familiar

### 3. GrupoFamiliar.tsx ⏳ PENDIENTE
- **Requiere**: Endpoint nuevo `GET /api/grupos-familiares/mi-grupo`
- **Debe mostrar**:
  - Lista de miembros del grupo familiar
  - Quién es el titular
  - Información de cada miembro

### 4. Dashboard.tsx ✅ OK (No requiere cambios)
- **Estado**: Solo muestra el menú, no tiene datos específicos

### 5. PaymentHistory.tsx (página de historial) ⏳ PENDIENTE
- **Requiere**: Ya existe `GET /api/deportistas/mi-historial`
- **Debe mostrar**: Historial de pagos realizados

## Próximos pasos:

1. **Crear endpoint de cuotas pendientes** en backend
2. **Crear endpoint de grupo familiar** en backend  
3. **Actualizar DebtStatus.tsx** para usar el endpoint de cuotas
4. **Actualizar GrupoFamiliar.tsx** para usar el endpoint de grupo
5. **Verificar y actualizar PaymentHistory.tsx** si existe

## Estado actual:
- ProfileEdit.tsx: ✅ Conectado al backend
- DebtStatus.tsx: ❌ Usando mocks
- GrupoFamiliar.tsx: ❌ Usando mocks
- Dashboard.tsx: ✅ OK (sin datos)
