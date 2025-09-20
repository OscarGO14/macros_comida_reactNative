# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Starting Development
- `npm install` - Install dependencies
- `npm start` or `npx expo start` - Start development server
- `npm run android` - Start on Android device
- `npm run ios` - Start on iOS device
- `npm run web` - Start web version

### Code Quality & Building
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Run ESLint and auto-fix issues
- `npm run build:web` - Build for web deployment

## Project Architecture

### Tech Stack
This is a React Native application built with:
- **React Native** 0.76.9 with **Expo** ~52.0.46
- **TypeScript** 5.3.3 for type safety
- **NativeWind** 4.1.23 for Tailwind CSS styling
- **Firebase** 11.6.1 for authentication and Firestore database
- **Zustand** for state management with AsyncStorage persistence
- **Expo Router** 4.0.20 for file-based routing

### Core Application Purpose
Macro and calorie tracking application that allows users to:
- Register/authenticate and manage daily caloric goals
- Log meals with ingredients and recipes
- View consumption history and progress charts
- Track macronutrient intake

### Key Architectural Patterns

#### Authentication & State Flow
The app uses a sophisticated auth flow combining Firebase Auth with Zustand state management:

1. **App Initialization** (`app/_layout.tsx`):
   - Firebase Auth checks for persisted sessions via `onAuthStateChanged`
   - Zustand loads cached user data from AsyncStorage for immediate UI display
   - On auth success: `getUserQuery` fetches fresh data from Firestore → `setUser` updates Zustand
   - Automatic routing: unauthenticated users → `/(auth)/login`, authenticated → `/(app)/dashboard`

2. **User Registration** (`app/(auth)/register.tsx`):
   - Creates Firebase Auth user → creates Firestore document → immediately calls `setUser` with initial data
   - Handles race conditions between Firestore write and auth state listener

3. **State Persistence**: Zustand middleware persists user state to AsyncStorage, providing offline-first UX

#### Routing Structure
Uses Expo Router with file-based routing:
- `app/(auth)/` - Authentication screens (login, register)
- `app/(app)/dashboard/` - Main dashboard and history
- `app/(app)/ingredients/` - Ingredient and recipe management
- `app/(app)/meals/` - Meal logging
- `app/(app)/settings/` - User settings and profile

#### Data Layer
- **Firebase Services** (`src/services/firebase.ts`): Centralized Firebase configuration and user CRUD operations
- **Zustand Store** (`src/store/userStore.ts`): Global state with persistence middleware
- **Collections**: Users, Ingredients, Recipes stored in Firestore

### Styling System
- **NativeWind**: Tailwind CSS for React Native
- **Custom Colors** (`src/types/colors.ts`): Centralized color palette using `const as const` pattern
- **Tailwind Config** (`tailwind.config.js`): Extended with project colors and responsive font sizes
- **Dark Theme Ready**: Uses class-based dark mode configuration

### Import Alias System
Babel module resolver configured with `@` alias pointing to `src/`:
```typescript
import { useCustomHook } from '@/hooks/useCustomHook';
```

### Development Standards
- **Language**: All UI text and code comments in Spanish
- **Type Safety**: Prefer `const as const` over enums
- **Component Structure**: Each component in own folder with `index.tsx` and `types.ts`
- **Code Style**: ESLint + Prettier with React Native specific rules
- **Git**: Single `master` branch workflow

### Key Dependencies
- `react-native-gifted-charts` for data visualization
- `react-native-toast-message` for notifications
- `expo-linear-gradient` for UI gradients
- `firebase-admin` (dev) for backend operations

### Environment Configuration
- Firebase config via Expo Constants from `.env` file
- Service account key for Firebase Admin operations
- Node.js 22.15.0 specified via Volta

## Important Implementation Notes

1. **Firebase Auth Persistence**: Uses `getReactNativePersistence` with AsyncStorage for cross-session auth
2. **Type Definitions**: User state and Firebase data models defined in `src/types/`
3. **Error Handling**: Comprehensive try-catch in auth flow with fallback states
4. **Performance**: Zustand persistence enables immediate UI rendering while Firebase loads fresh data
5. **Security**: Environment variables for all Firebase credentials, never committed to repo