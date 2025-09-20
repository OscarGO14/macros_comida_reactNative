# 🔧 Lista de Tareas de Mejora - Gestión de Datos

## Estado: 0/13 completadas

---

## 🚨 **Tareas Críticas (Prioridad Alta)**

### 🔄 1. Fix duplicate password inputs in register.tsx
- **Estado**: En progreso
- **Problema**: Inputs de contraseña duplicados en el formulario de registro
- **Impacto**: UX confusa, posibles errores de validación
- **Estimación**: 5 minutos
- **Archivos**: `app/(auth)/register.tsx:134-145`
- **Desarrollador**: -
- **Revisor**: -
- **Fecha completada**: -

### 🔄 2. Standardize Firebase collection references in firebase.ts
- **Estado**: En progreso
- **Problema**: Mezcla de strings hardcoded y constantes para colecciones
- **Impacto**: Inconsistencia, riesgo de errores tipográficos
- **Estimación**: 10 minutos
- **Archivos**: `src/services/firebase.ts:67, 76`
- **Desarrollador**: -
- **Revisor**: -
- **Fecha completada**: -

### 🔄 3. Optimize getUserQuery to use direct document access
- **Estado**: En progreso
- **Problema**: Query ineficiente usando `where` en lugar de acceso directo por ID
- **Impacto**: Performance, costos de Firebase
- **Estimación**: 15 minutos
- **Archivos**: `src/services/firebase.ts:53-64`
- **Desarrollador**: -
- **Revisor**: -
- **Fecha completada**: -

---

## ⚠️ **Tareas de Estabilidad (Prioridad Media-Alta)**

### 🔄 4. Fix race condition in user registration flow
- **Estado**: En progreso
- **Problema**: Conflicto entre `setUser` manual y `onAuthStateChanged`
- **Impacto**: Estado inconsistente durante registro
- **Estimación**: 30 minutos
- **Archivos**: `app/(auth)/register.tsx`, `app/_layout.tsx`
- **Desarrollador**: -
- **Revisor**: -
- **Fecha completada**: -

### 🔄 5. Improve error handling and propagation in Firebase services
- **Estado**: En progreso
- **Problema**: Errores no se propagan, solo se consolelogan
- **Impacto**: Debugging difícil, UX pobre en errores
- **Estimación**: 45 minutos
- **Archivos**: `src/services/firebase.ts`
- **Desarrollador**: -
- **Revisor**: -
- **Fecha completada**: -

### 🔄 6. Standardize user state update functions in userStore
- **Estado**: En progreso
- **Problema**: Funciones `setUser` y `updateUserData` tienen comportamiento inconsistente
- **Impacto**: Lógica confusa, posibles bugs
- **Estimación**: 25 minutos
- **Archivos**: `src/store/userStore.ts`
- **Desarrollador**: -
- **Revisor**: -
- **Fecha completada**: -

---

## 📈 **Tareas de Optimización (Prioridad Media)**

### 🔄 7. Optimize Zustand persistence with partialize
- **Estado**: En progreso
- **Problema**: Se persiste todo el estado innecesariamente
- **Impacto**: Performance, storage usage
- **Estimación**: 20 minutos
- **Archivos**: `src/store/userStore.ts`
- **Desarrollador**: -
- **Revisor**: -
- **Fecha completada**: -

### 🔄 8. Add input validation for user goals (calories, macros)
- **Estado**: En progreso
- **Problema**: No hay validación de rangos razonables
- **Impacto**: Datos inconsistentes, UX pobre
- **Estimación**: 30 minutos
- **Archivos**: `app/(app)/settings/updateUser.tsx`
- **Desarrollador**: -
- **Revisor**: -
- **Fecha completada**: -

### 🔄 9. Implement optimistic updates for user data changes
- **Estado**: En progreso
- **Problema**: UI espera respuesta de Firebase antes de actualizar
- **Impacto**: UX lenta
- **Estimación**: 45 minutos
- **Archivos**: `app/(app)/settings/updateUser.tsx`, `app/(app)/meals/add-meal.tsx`
- **Desarrollador**: -
- **Revisor**: -
- **Fecha completada**: -

---

## 🏗️ **Tareas Arquitecturales (Prioridad Media-Baja)**

### 🔄 10. Separate authentication logic from _layout.tsx
- **Estado**: En progreso
- **Problema**: Demasiadas responsabilidades en un solo componente
- **Impacto**: Mantenibilidad, testing
- **Estimación**: 60 minutos
- **Archivos**: `app/_layout.tsx` → crear `src/hooks/useAuth.ts`
- **Desarrollador**: -
- **Revisor**: -
- **Fecha completada**: -

### 🔄 11. Create centralized Firebase service layer
- **Estado**: En progreso
- **Problema**: Operaciones Firebase dispersas, manejo de errores inconsistente
- **Impacto**: Mantenibilidad, consistencia
- **Estimación**: 90 minutos
- **Archivos**: Crear `src/services/userService.ts`, `src/services/dataService.ts`
- **Desarrollador**: -
- **Revisor**: -
- **Fecha completada**: -

---

## 🌐 **Tareas de Robustez (Prioridad Baja)**

### 🔄 12. Add offline support and retry logic
- **Estado**: En progreso
- **Problema**: No hay manejo de estados offline/reconexión
- **Impacto**: UX en condiciones de red pobres
- **Estimación**: 120 minutos
- **Archivos**: `src/services/`, `src/hooks/`
- **Desarrollador**: -
- **Revisor**: -
- **Fecha completada**: -

### 🔄 13. Implement data synchronization layer
- **Estado**: En progreso
- **Problema**: Sincronización Firebase-Zustand puede ser inconsistente
- **Impacto**: Estado eventual inconsistente
- **Estimación**: 180 minutos
- **Archivos**: Crear `src/services/syncService.ts`
- **Desarrollador**: -
- **Revisor**: -
- **Fecha completada**: -

---

## 📊 **Estadísticas**
- **Total de tareas**: 13
- **Completadas**: 0
- **En progreso**: 0
- **Pendientes**: 13
- **Tiempo estimado total**: ~10-12 horas

## 📋 **Orden Recomendado**
1. **Semana 1**: Tareas 1-3 (fixes críticos rápidos)
2. **Semana 2**: Tareas 4-6 (estabilidad)
3. **Semana 3**: Tareas 7-9 (optimizaciones)
4. **Semana 4+**: Tareas 10-13 (arquitectura y robustez)

---

*Última actualización: 2025-01-20*