import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

/**
 * Custom hook that manages authentication-based navigation
 * Handles redirects based on user auth state and current route
 */
export const useAuthNavigation = (isAuthenticated: boolean, isLoading: boolean) => {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    // Asegurarse de que segments existe y tiene elementos antes de acceder a segments[0]
    const inAuthGroup = segments.length > 0 && segments[0] === '(auth)';
    const isAtRoot = segments.length === 0;

    if (!isAuthenticated && !inAuthGroup) {
      // Usuario no autenticado y no está en páginas de auth → redirigir a login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Usuario autenticado pero está en páginas de auth → redirigir a app
      router.replace('/(app)/dashboard');
    } else if (isAuthenticated && isAtRoot) {
      // Usuario autenticado pero está en la raíz → redirigir a app
      router.replace('/(app)/dashboard');
    }
    // Casos que no requieren redirección:
    // - Usuario no autenticado y está en (auth) → ya está donde debe
    // - Usuario autenticado y está en (app) → ya está donde debe
  }, [isAuthenticated, segments, router, isLoading]);
};