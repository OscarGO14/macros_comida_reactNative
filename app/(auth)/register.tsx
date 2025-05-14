import React, { useState } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Link } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app'; // FirebaseError para type checking
import { auth, usersCollection } from '@/services/firebase'; // Nuestros servicios

import { useUserStore } from '@/store/userStore';
import { defaultGoals } from '@/types/goals';
import { IUserStateData } from '@/types/user';
import { doc, setDoc } from 'firebase/firestore';
import InputText from '@/components/ui/InputText';
import Screen from '@/components/ui/Screen';
import SubmitButton from '@/components/ui/SubmitButton';
import { MyColors } from '@/types/colors';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setError, setUser } = useUserStore();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor, rellena todos los campos.',
      });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Las contraseñas no coinciden.',
      });
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
      Toast.show({
        type: 'error',
        text1: 'Error en Registro',
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
        <TouchableWithoutFeedback onPress={handleTouchOutside}>
          <View className="w-full max-w-md gap-4">
            <Text className="mb-8 text-3xl font-bold text-primary">Crear Cuenta</Text>

            <View className="w-full justify-center gap-4 p-4">
              <InputText
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={handleInputBlur}
              />
              <InputText
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onBlur={handleInputBlur}
              />
              <InputText
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                onBlur={handleInputBlur}
              />

              <InputText
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <InputText
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              {loading ? (
                <ActivityIndicator size="large" color={MyColors.ACCENT} />
              ) : (
                <SubmitButton label="Registrarse" onPress={handleRegister} />
              )}
            </View>

            <Link href="/(auth)/login" replace className="mt-6">
              <Text className="text-alternate">¿Ya tienes cuenta? Inicia Sesión</Text>
            </Link>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Screen>
  );
}
