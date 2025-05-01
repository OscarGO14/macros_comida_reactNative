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
