import React, { useState } from 'react';
import { Text, View, ActivityIndicator, Alert } from 'react-native';
import { Link } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/services/firebase';
import { useUserStore } from '@/store/userStore';
import InputText from '@/components/ui/InputText';
import Screen from '@/components/ui/Screen';
import SubmitButton from '@/components/ui/SubmitButton';
import { MyColors } from '@/types/colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setError } = useUserStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, introduce tu email y contraseña.');
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
      Alert.alert('Error en Login', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View className="flex-1 items-center justify-center">
        <Text className="mb-8 text-3xl font-bold text-white">Iniciar Sesión</Text>

        <View className="w-full justify-center gap-4 p-4">
          <InputText
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
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
