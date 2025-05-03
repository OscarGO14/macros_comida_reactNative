import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserQuery } from '@/services/firebase';
import { IUserStateData } from '@/types/user';
import '../global.css';

export default function RootLayoutNav() {
  const { user, isLoading, setUser, setLoading } = useUserStore();
  const router = useRouter();
  const segments = useSegments();

  // Listener de estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: IUserStateData | null) => {
      console.log('Auth state changed:', firebaseUser?.uid);

      if (firebaseUser) {
        getUserQuery(firebaseUser.uid).then((user) => {
          if (user) {
            setUser(user);
          }
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

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

  return <Slot />;
}
