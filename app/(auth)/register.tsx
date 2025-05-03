import React, { useState } from 'react';
import { Text, Button, TextInput, View, ActivityIndicator, Alert } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// Firebase Auth
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app'; // FirebaseError para type checking
import { auth, usersCollection } from '@/services/firebase'; // Nuestros servicios

import { useUserStore } from '@/store/userStore';
import { defaultGoals } from '@/types/goals';
import { IUserStateData } from '@/types/user';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setError, setUser } = useUserStore();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor, rellena todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      // 1. Crear usuario en Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Crear documento de usuario en Firestore
      const initialUserData: IUserStateData = {
        uid: user.uid,
        email: user.email,
        displayName: user.email?.split('@')[0] || '',
        dailyGoals: defaultGoals,
        customRecipes: [],
        history: {},
      };

      await setDoc(doc(usersCollection, user.uid), initialUserData);
      setUser(initialUserData);
    } catch (error) {
      let errorMessage = 'Ha ocurrido un error inesperado durante el registro.';
      if (error instanceof FirebaseError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Error en registro completo:', error);
      setError(new Error(errorMessage));
      Alert.alert('Error en Registro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background p-4">
      <Text className="mb-8 text-3xl font-bold text-primary">Crear Cuenta</Text>

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
          className="mb-4 h-12 w-full rounded-md border border-alternate bg-background px-4 text-primary"
          placeholder="Contraseña"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          className="mb-6 h-12 w-full rounded-md border border-alternate bg-background px-4 text-primary"
          placeholder="Confirmar Contraseña"
          placeholderTextColor="#9CA3AF"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color="#FACC15" />
        ) : (
          <Button title="Registrarse" onPress={handleRegister} color="#FACC15" />
        )}
      </View>

      <Link href="/(auth)/login" replace className="mt-6">
        <Text className="text-alternate">¿Ya tienes cuenta? Inicia Sesión</Text>
      </Link>
    </SafeAreaView>
  );
}
