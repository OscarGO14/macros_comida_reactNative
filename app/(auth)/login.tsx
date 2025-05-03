import React, { useState } from 'react';
import { Text, Button, TextInput, View, ActivityIndicator, Alert } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/services/firebase';
import { useUserStore } from '@/store/userStore';

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
    <SafeAreaView className="flex-1 items-center justify-center bg-background p-4">
      <Text className="mb-8 text-3xl font-bold text-white">Iniciar Sesión</Text>

      <View className="w-full max-w-xs">
        <TextInput
          className="mb-4 h-12 w-full rounded-md border border-alternate bg-background px-4 text-primary"
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="mb-6 h-12 w-full rounded-md border border-alternate bg-background px-4 text-primary"
          placeholder="Contraseña"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color="#FACC15" />
        ) : (
          <Button title="Iniciar Sesión" onPress={handleLogin} color="#FACC15" />
        )}
      </View>

      <Link href="/(auth)/register" replace className="mt-6">
        <Text className="text-alternate">¿No tienes cuenta? Regístrate</Text>
      </Link>
    </SafeAreaView>
  );
}
