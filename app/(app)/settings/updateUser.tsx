import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Alert, ActivityIndicator } from 'react-native';
import Button from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';
import { Goals } from '@/types/goals';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '@/services/firebase';
import { FirebaseError } from 'firebase/app';
import Screen from '@/components/ui/Screen';

export default function UpdateUserScreen() {
  const { user, setUser } = useUserStore();

  const [displayName, setDisplayName] = useState('');
  const [calories, setCalories] = useState('');
  const [proteins, setProteins] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setCalories(user.dailyGoals?.calories?.toString() || '');
      setProteins(user.dailyGoals?.proteins?.toString() || '');
      setCarbs(user.dailyGoals?.carbs?.toString() || '');
      setFats(user.dailyGoals?.fats?.toString() || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Error', 'No se pueden guardar los cambios sin un usuario válido.');
      return;
    }

    const numCalories = parseInt(calories, 10);
    const numProteins = parseInt(proteins, 10);
    const numCarbs = parseInt(carbs, 10);
    const numFats = parseInt(fats, 10);

    if (isNaN(numCalories) || isNaN(numProteins) || isNaN(numCarbs) || isNaN(numFats)) {
      Alert.alert('Error', 'Por favor, introduce valores numéricos válidos para las metas.');
      return;
    }

    setLoading(true);

    const updatedGoals: Goals = {
      calories: numCalories,
      proteins: numProteins,
      carbs: numCarbs,
      fats: numFats,
    };

    const dataToUpdate: Partial<typeof user> = {
      displayName: displayName,
      dailyGoals: updatedGoals,
    };

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, dataToUpdate);
      console.log('Documento de Firestore actualizado.');

      const currentUser = auth.currentUser;
      if (currentUser && currentUser.displayName !== displayName) {
        await updateProfile(currentUser, { displayName });
        console.log('Perfil de Firebase Auth actualizado.');
      }

      const updatedUser = { ...user, ...dataToUpdate };
      setUser(updatedUser);

      Alert.alert('Éxito', 'Perfil y metas actualizados correctamente.');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      let errorMessage = 'Ocurrió un error al guardar los cambios.';
      if (error instanceof FirebaseError) {
        errorMessage = `Error: ${error.message} (${error.code})`;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Screen>
        <ActivityIndicator size="large" color="#FACC15" />
        <Text className="mt-4 text-primary">Cargando datos del usuario...</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text className="mb-6 text-2xl font-bold text-primary">Actualizar Perfil y Metas</Text>

      <View className="w-full max-w-sm">
        <Text className="mb-2 text-sm font-medium text-gray-400">Nombre de Usuario</Text>
        <TextInput
          className="mb-4 h-12 w-full rounded-md border border-alternate bg-input px-4 text-primary"
          placeholder="Tu nombre de usuario"
          placeholderTextColor="#9CA3AF"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
        />

        <Text className="mb-2 text-sm font-medium text-gray-400">Metas Diarias</Text>
        <TextInput
          className="mb-4 h-12 w-full rounded-md border border-alternate bg-input px-4 text-primary"
          placeholder="Calorías (kcal)"
          placeholderTextColor="#9CA3AF"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
        />
        <TextInput
          className="mb-4 h-12 w-full rounded-md border border-alternate bg-input px-4 text-primary"
          placeholder="Proteínas (g)"
          placeholderTextColor="#9CA3AF"
          value={proteins}
          onChangeText={setProteins}
          keyboardType="numeric"
        />
        <TextInput
          className="mb-4 h-12 w-full rounded-md border border-alternate bg-input px-4 text-primary"
          placeholder="Carbohidratos (g)"
          placeholderTextColor="#9CA3AF"
          value={carbs}
          onChangeText={setCarbs}
          keyboardType="numeric"
        />
        <TextInput
          className="mb-6 h-12 w-full rounded-md border border-alternate bg-input px-4 text-primary"
          placeholder="Grasas (g)"
          placeholderTextColor="#9CA3AF"
          value={fats}
          onChangeText={setFats}
          keyboardType="numeric"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#FACC15" />
        ) : (
          <Button title="Guardar Cambios" onPress={handleSave} className="bg-accent" />
        )}
      </View>
    </Screen>
  );
}
