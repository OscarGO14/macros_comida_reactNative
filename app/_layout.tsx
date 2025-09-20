import React from 'react';
import { Slot } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/hooks/useAuth';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';
import toastConfig from '@/components/MyToast';
import '../global.css';

export default function RootLayoutNav() {
  // Usar hooks personalizados para separar responsabilidades
  const { user, isLoading, isAuthenticated } = useAuth();
  useAuthNavigation(isAuthenticated, isLoading);

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
