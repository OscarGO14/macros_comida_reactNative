import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { FirebaseError } from 'firebase/app';
import Button from '@/components/ui/Button';
import InputText from '@/components/ui/InputText';
import { useUserStore } from '@/store/userStore';
import { Goals } from '@/types/goals';
import { updateUser } from '@/services/firebase';
import Screen from '@/components/ui/Screen';
import { MyColors } from '@/types/colors';
import ConfirmationModal from '@/components/ConfirmationModal';
import Toast from 'react-native-toast-message';

export default function UpdateUserScreen() {
  const { user, setUser } = useUserStore();

  const [displayName, setDisplayName] = useState('');
  const [calories, setCalories] = useState('');
  const [proteins, setProteins] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [loading, setLoading] = useState(false);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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
      console.log('No se pueden guardar los cambios sin un usuario válido.');
      return;
    }

    const numCalories = parseInt(calories, 10);
    const numProteins = parseInt(proteins, 10);
    const numCarbs = parseInt(carbs, 10);
    const numFats = parseInt(fats, 10);

    if (isNaN(numCalories) || isNaN(numProteins) || isNaN(numCarbs) || isNaN(numFats)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor, introduce valores numéricos válidos para las metas.',
      });
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
      await updateUser(user.uid, dataToUpdate);

      const updatedUser = { ...user, ...dataToUpdate };
      setUser(updatedUser);

      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Los cambios se han guardado correctamente.',
      });
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      let errorMessage = 'Ocurrió un error al guardar los cambios.';
      if (error instanceof FirebaseError) {
        errorMessage = `Error: ${error.message} (${error.code})`;
      }
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View className="flex-1 justify-around" onTouchStart={handleTouchOutside}>
          <Text className="mb-6 text-2xl font-bold text-primary">Actualiza tu información</Text>
          <View className="w-full gap-4 ">
            <InputText
              label="Nombre de Usuario"
              placeholder="Tu nombre de usuario"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              onBlur={handleInputBlur}
            />

            <InputText
              label="Calorías (kcal)"
              placeholder="Calorías (kcal)"
              value={calories}
              onChangeText={setCalories}
              keyboardType="decimal-pad"
              onBlur={handleInputBlur}
            />
            <InputText
              label="Proteínas (g)"
              placeholder="Proteínas (g)"
              value={proteins}
              onChangeText={setProteins}
              keyboardType="decimal-pad"
              onBlur={handleInputBlur}
            />
            <InputText
              label="Carbohidratos (g)"
              placeholder="Carbohidratos (g)"
              value={carbs}
              onChangeText={setCarbs}
              keyboardType="decimal-pad"
              onBlur={handleInputBlur}
            />
            <InputText
              label="Grasas (g)"
              placeholder="Grasas (g)"
              value={fats}
              onChangeText={setFats}
              keyboardType="decimal-pad"
              onBlur={handleInputBlur}
            />
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={MyColors.ACCENT} />
          ) : (
            <Button
              title="Guardar Cambios"
              onPress={() => setShowConfirmationModal(true)}
              className="bg-accent"
            />
          )}
        </View>
        <ConfirmationModal
          isVisible={showConfirmationModal}
          handleConfirm={handleSave}
          onClose={() => setShowConfirmationModal(false)}
          message="¿Estás seguro de que quieres guardar los cambios?"
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}
