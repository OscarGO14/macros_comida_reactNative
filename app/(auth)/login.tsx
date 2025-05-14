import React, { useState } from 'react';
import { Text, View, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Link } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/services/firebase';
import { useUserStore } from '@/store/userStore';
import InputText from '@/components/ui/InputText';
import Screen from '@/components/ui/Screen';
import SubmitButton from '@/components/ui/SubmitButton';
import { MyColors } from '@/types/colors';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setError } = useUserStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor, introduce tu email y contraseña.',
      });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login exitoso:', userCredential.user.uid);
    } catch (error) {
      let errorMessage = 'Ha ocurrido un error inesperado.';
      if (error instanceof FirebaseError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Error en login:', error);
      setError(new Error(errorMessage));
      Toast.show({
        type: 'error',
        text1: 'Error en Login',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Ocultar teclado al tocar fuera
  const handleTouchOutside = () => {
    Keyboard.dismiss();
  };

  // Resetear scroll en web al perder foco
  const handleInputBlur = () => {
    if (Platform.OS === 'web') {
      window.scrollTo(0, 0);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1 items-center justify-center"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View className="w-full max-w-md gap-4 " onTouchStart={handleTouchOutside}>
          <Text className="mb-8 text-3xl font-bold text-white">Iniciar Sesión</Text>

          <View className="w-full justify-center gap-4 p-4">
            <InputText
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={handleInputBlur}
            />
          />

          <InputText
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {loading ? (
            <ActivityIndicator size="large" color={MyColors.ACCENT} />
          ) : (
            <SubmitButton label="Iniciar Sesión" onPress={handleLogin} />
          )}
        </View>

        <Link href="/(auth)/register" replace className="mt-6">
          <Text className="text-alternate">¿No tienes cuenta? Regístrate</Text>
        </Link>
      </View>
    </Screen>
  );
}
