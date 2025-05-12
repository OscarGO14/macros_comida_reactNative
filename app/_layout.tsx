import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useUserStore } from '@/store/userStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserQuery } from '@/services/firebase';
import toastConfig from '@/components/MyToast';
import '../global.css';

export default function RootLayoutNav() {
  const { user, isLoading, setUser, setLoading } = useUserStore();
  const router = useRouter();
  const segments = useSegments();

  // Listener de estado de autenticación
  useEffect(() => {
    setLoading(true); // Asegurarse de que estamos cargando al inicio
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Marcar como async
      console.log('Auth state changed:', firebaseUser?.uid);

      try {
        if (firebaseUser) {
          // Esperar a que getUserQuery termine
          const userData = await getUserQuery(firebaseUser.uid);
          if (userData) {
            setUser(userData);
          } else {
            // Usuario autenticado en Firebase pero sin datos en Firestore?
            // Decide cómo manejar este caso. ¿Quizás desloguear o usar datos básicos?
            console.warn('Usuario autenticado pero no encontrado en Firestore:', firebaseUser.uid);
            setUser(null); // O manejar de otra forma
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error durante el chequeo de autenticación:', error);
        setUser(null); // Asegurarse de resetear en caso de error
      } finally {
        setLoading(false); // Poner loading en false DESPUÉS de procesar todo
      }
    });

    return () => unsubscribe();
    // Quitar setLoading de las dependencias si estaba, solo necesitamos setUser
  }, [setUser]);

  // Efecto para la redirección
  useEffect(() => {
    if (isLoading) return;

    // Asegurarse de que segments existe y tiene elementos antes de acceder a segments[0]
    const inAuthGroup = segments.length > 0 && segments[0] === '(auth)';
    // @ts-expect-error segments es string[]
    const isAtRoot = segments.length === 0;
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Si hay usuario y estamos en (auth), redirigir a la app
      router.replace('/(app)/dashboard');
    } else if (user && isAtRoot) {
      // Si hay usuario y estamos en la raíz (caso inicial), redirigir a la app
      router.replace('/(app)/dashboard');
    }
    // Añadir caso: Si no hay usuario y estamos en (auth), no hacer nada (ya estamos donde debemos)
    // Añadir caso: Si hay usuario y estamos en (app), no hacer nada (ya estamos donde debemos)
  }, [user, segments, router, isLoading]);

  if (isLoading) {
    // Podríamos mostrar un SplashScreen aquí en lugar de null
    return null;
  }

  // implement toast

  return (
    <>
      <Slot />
      <Toast position="bottom" bottomOffset={300} config={toastConfig} />
    </>
  );
}
