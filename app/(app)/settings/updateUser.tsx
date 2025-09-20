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
import { validateMacroGoals, validateDisplayName } from '@/utils/validation';

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

    // Validar nombre de usuario
    const nameValidation = validateDisplayName(displayName);
    if (!nameValidation.isValid) {
      Toast.show({
        type: 'error',
        text1: 'Error en el nombre',
        text2: nameValidation.error,
      });
      return;
    }

    const numCalories = parseInt(calories, 10);
    const numProteins = parseInt(proteins, 10);
    const numCarbs = parseInt(carbs, 10);
    const numFats = parseInt(fats, 10);

    // Validar macronutrientes
    const macroValidation = validateMacroGoals(numCalories, numProteins, numCarbs, numFats);

    if (!macroValidation.overall.isValid) {
      let errorMessage = 'Errores de validación:\n';

      if (!macroValidation.calories.isValid) {
        errorMessage += `• ${macroValidation.calories.error}\n`;
      }
      if (!macroValidation.proteins.isValid) {
        errorMessage += `• ${macroValidation.proteins.error}\n`;
      }
      if (!macroValidation.carbs.isValid) {
        errorMessage += `• ${macroValidation.carbs.error}\n`;
      }
      if (!macroValidation.fats.isValid) {
        errorMessage += `• ${macroValidation.fats.error}\n`;
      }
      if (macroValidation.overall.error) {
        errorMessage += `• ${macroValidation.overall.error}`;
      }

      Toast.show({
        type: 'error',
        text1: 'Valores inválidos',
        text2: errorMessage.trim(),
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

    // Optimistic update: actualizar UI inmediatamente
    const updatedUser = { ...user, ...dataToUpdate };
    const previousUser = user; // Guardar estado anterior para rollback
    setUser(updatedUser);

    try {
      await updateUser(user.uid, dataToUpdate);

      // Si llega aquí, la actualización fue exitosa
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: 'Los cambios se han guardado correctamente.',
      });
    } catch (error) {
      // Rollback: revertir al estado anterior en caso de error
      setUser(previousUser);
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
