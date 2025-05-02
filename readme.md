# README

Guía para el desarrollo de la aplicación en React Native, utilizando Expo, Firebase, NativeWind y TypeScript.

## Instalación

npm install

## Iniciar el proyecto

npx expo start

## Finalidad del Proyecto

El objetivo principal de esta aplicación es proporcionar una plataforma para la gestión de las calorías consumidas por los usuarios.

## Funcionalidades Principales

1. **Registro y Autenticación:**

   - Los usuarios pueden registrarse y autenticarse en la aplicación.

2. **Registro de Comidas:**

   - Los usuarios pueden registrar las comidas que consumen, incluyendo la cantidad de calorías.

3. **Historial de Comidas:**

   - Los usuarios pueden ver un historial de las comidas registradas, incluyendo la fecha y la cantidad de calorías consumidas.

4. **Objetivo de Calorías:**

   - Los usuarios pueden establecer un objetivo de calorías diarias y ver su progreso.

5. **Gráficos y Estadísticas:**
   - Los usuarios pueden ver gráficos y estadísticas de su consumo de calorías.

# Guías de Código

## 1. Estilo de Código

- **Convenciones de nombres:**
  Usar `camelCase` para variables, funciones y propiedades.

- **Imports:**
  Siempre usar alias para mayor claridad y evitar conflictos.

- **Comentarios:**
  Solo los necesarios para entender partes complejas o poco evidentes del código.

- **Formato de código:**
  Usar un linter para mantener un estilo consistente en todo el proyecto.

- **Estructura de carpetas:**
  Cada componente debe tener su propia carpeta. Dentro de cada carpeta se generará un index.tsx para exportar el componente. Un types.ts para los tipos.

## 2. Estructura del Proyecto

Organización recomendada de carpetas y archivos:

- `app/`
- `src/hooks/`
- `src/assets/`
- `src/components/`
- `src/services/`
- `src/types/` (para los tipados)
- `src/utils/`

> Cuando crees nuevos archivos, respeta esta estructura para mantener el orden y facilitar el mantenimiento.

## 3. Versiones de Dependencias

Las versiones de todas las dependencias deben ser exactamente las que figuran en el `package.json` del proyecto.

> No actualices ni agregues paquetes sin revisar compatibilidad.

## 4. Seguridad

- **API Keys y datos sensibles:**
  Todas las claves y credenciales deben almacenarse en archivos `.env` y nunca en el código fuente ni en el repositorio.

## 5. Librerías Core del Proyecto

- React Native
- Expo
- Firebase
- NativeWind
- TypeScript

> Prioriza estas librerías para nuevas funcionalidades y evita dependencias innecesarias.

## 6. Internacionalización

- La app es solo en español por ahora.
- Todos los textos y mensajes deben estar en español.

## 7. Git

- La rama única es `master`.

## 8. Comunicación y Colaboración con IA

- Las explicaciones deben detallar el por qué de cada cambio, especialmente en React Native y Tailwind, para favorecer el aprendizaje.
- El idioma de las respuestas y comentarios será español.
- Se permiten y fomentan sugerencias proactivas para mejorar el código o la estructura.

## Ejemplo de Import con Alias

```typescript
import { useCustomHook } from '@/hooks/useCustomHook';
```

## Ejemplo de declaración de enumeracionesº

```typescript
const MyColors = {
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  YELLOW: '#facc15',
} as const;

export type MyColor = (typeof MyColors)[keyof typeof MyColors];
export { MyColors };
```

## Flujo de Autenticación y Datos de Usuario

Esta sección describe cómo la aplicación maneja el inicio de sesión, el registro, el cierre de sesión y la sincronización de datos del usuario entre Firebase y el estado local (Zustand).

### 1. Arranque de la Aplicación y Comprobación de Sesión

-   **Firebase Auth Persistence:** Al iniciar, Firebase Auth (con `getReactNativePersistence`) comprueba si existe un token de sesión válido guardado localmente.
-   **Zustand Persistence:** Simultáneamente, Zustand (`persist` middleware) carga el último estado conocido del usuario (`IUserStateData`) desde AsyncStorage. Esto permite mostrar datos cacheados en la UI casi instantáneamente.
-   **`onAuthStateChanged` Listener (`app/_layout.tsx`):** Un listener global espera la respuesta de Firebase Auth.
    -   **Si hay sesión activa (Firebase User existe):** Se llama a `getUserQuery` para obtener los datos más recientes del usuario desde Firestore. Una vez obtenidos, se llama a `setUser` para actualizar el store de Zustand (y su caché persistente) con estos datos frescos.
    -   **Si no hay sesión activa (Firebase User es `null`):** Se llama a `setUser(null)` para limpiar el store de Zustand y su caché.
-   **Redirección (`app/_layout.tsx`):** Otro `useEffect` observa el estado `user` en Zustand y `isLoading`. Cuando `isLoading` es `false`, redirige al usuario a `/(auth)/login` si `user` es `null`, o a `/(app)` si `user` existe y el usuario está en una ruta de autenticación.

### 2. Registro de Nuevo Usuario (`app/(auth)/register.tsx`)

1.  El usuario introduce email y contraseña.
2.  Se llama a `createUserWithEmailAndPassword(auth, email, password)`.
3.  Si tiene éxito:
    -   `onAuthStateChanged` se dispara (con el nuevo `firebaseUser`). El listener inicia `getUserQuery`.
    -   **Inmediatamente después**, la función `handleRegister`:
        -   Crea el objeto `initialUserData` con valores por defecto.
        -   Llama a `setDoc(doc(usersCollection, user.uid), initialUserData)` para crear el documento del usuario en Firestore.
        -   **Llama a `setUser(initialUserData)`**. Esto actualiza el store de Zustand *inmediatamente*, asegurando que la UI tenga datos y la redirección funcione incluso si `setDoc` o `getUserQuery` tardan un poco.
    -   `getUserQuery` termina:
        -   Si encuentra el documento recién creado, llama a `setUser` de nuevo (actualización redundante pero inofensiva).
        -   Si *no* lo encuentra (por una condición de carrera mínima), no hace nada, preservando el estado ya establecido por `handleRegister`.
4.  La redirección en `_layout.tsx` lleva al usuario a `/(app)`.

### 3. Inicio de Sesión (`app/(auth)/login.tsx` - Flujo Asumido)

1.  El usuario introduce email y contraseña.
2.  Se llama a `signInWithEmailAndPassword(auth, email, password)`.
3.  Si tiene éxito:
    -   `onAuthStateChanged` se dispara (con el `firebaseUser`).
    -   El listener llama a `getUserQuery` para obtener los datos del usuario desde Firestore.
    -   Se llama a `setUser` con los datos obtenidos, actualizando Zustand y su caché.
4.  La redirección en `_layout.tsx` lleva al usuario a `/(app)`.

### 4. Cierre de Sesión (`src/components/LogOut/index.tsx`)

1.  El usuario pulsa el botón "Cerrar sesión".
2.  Se llama a `signOut(auth)`.
3.  Firebase Auth invalida el token y limpia su persistencia.
4.  `onAuthStateChanged` se dispara (con `firebaseUser` siendo `null`).
5.  El listener llama a `setUser(null)`.
6.  El middleware `persist` de Zustand detecta que `user` es `null` y elimina la entrada correspondiente de AsyncStorage.
7.  La redirección en `_layout.tsx` lleva al usuario a `/(auth)/login`.

### 5. Actualización de Datos de Usuario (Ej: `updateUser.tsx` - Flujo General)

1.  El usuario modifica algún dato (ej: metas diarias).
2.  Se llama a una función para actualizar Firestore (ej: `updateDoc` o `setDoc` con `{ merge: true }`).
3.  **Después** de que la escritura en Firestore sea exitosa, se llama a `setUser` (o una acción específica de actualización en `userStore`) con los *nuevos* datos para actualizar el estado local de Zustand y su caché. Esto asegura que la UI refleje los cambios inmediatamente.
