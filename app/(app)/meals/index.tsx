import React, { useMemo, useState } from 'react';
import Screen from '@/components/ui/Screen';
import { FlatList, Text, View } from 'react-native';
import { router } from 'expo-router';
import { StatsCard } from '@/components/ui/StatsCard';
import { useUserStore } from '@/store/userStore';
import { getDayOfWeek } from '@/utils/getDayOfWeek';
import ActionButton from '@/components/ui/ActionButton';
import { updateUser } from '@/services/firebase';
import { createEmptyDailyLog } from '@/utils/createEmpytDailyLog';
import ConfirmationModal from '@/components/ConfirmationModal';
import Toast from 'react-native-toast-message';

export default function MealsScreen() {
  const { user, updateUserData } = useUserStore();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const today = useMemo(() => getDayOfWeek(), []);

  const deleteMealsForToday = async () => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Usuario no encontrado.',
      });
      return;
    }

    const emptyLog = createEmptyDailyLog(); // Crear el log vacío con la fecha actual

    // Actualizar Firestore para restablecer el log del día
    await updateUser(user.uid, {
      history: {
        ...user.history,
        [today]: emptyLog,
      },
    });

    // Actualizar contexto de Zustand
    const updatedHistory = { ...user.history };
    updatedHistory[today] = emptyLog;

    updateUserData({
      ...user,
      history: updatedHistory,
    });

    Toast.show({
      type: 'success',
      text1: 'Éxito',
      text2: 'Se han borrado las comidas de hoy.',
    });
  };

  const dailyTotalMacros = useMemo(() => {
    if (user?.history && user.history[today]) {
      return user.history[today].totalMacros;
    }
    return { calories: 0, proteins: 0, carbs: 0, fats: 0 };
  }, [user, today]);

  const dailyMeals = useMemo(() => {
    if (user?.history && user.history[today]) {
      return user.history[today].meals;
    }
    return [];
  }, [user, today]);

  return (
    <Screen>
      <View className="flex-col flex-1 justify-between py-4">
        {dailyMeals ? (
          <FlatList
            data={dailyMeals}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item, index }) => (
              <View className="mb-2">
                <StatsCard
                  title={`Comida ${index + 1}`}
                  value={item.totalMacros.calories}
                  trend={[
                    `P: ${item.totalMacros.proteins.toFixed(1)}`,
                    `C: ${item.totalMacros.carbs.toFixed(1)}`,
                    `G: ${item.totalMacros.fats.toFixed(1)}`,
                  ]}
                >
                  {item.items.map((item) => (
                    <Text className="text-accent italic py-2" key={item.id}>
                      {item.name}
                    </Text>
                  ))}
                </StatsCard>
              </View>
            )}
          />
        ) : (
          <Text className="text-primary text-2xl font-bold text-center mb-6">No hay comidas</Text>
        )}
        <View className="mb-4">
          <StatsCard
            title="Total"
            value={dailyTotalMacros.calories}
            variant="accent"
            trend={[
              `P: ${dailyTotalMacros.proteins.toFixed(1)}`,
              `C: ${dailyTotalMacros.carbs.toFixed(1)}`,
              `G: ${dailyTotalMacros.fats.toFixed(1)}`,
            ]}
          />
        </View>
        <View className="flex-row justify-between">
          <ActionButton label="Borrar comidas" onPress={() => setShowConfirmationModal(true)} />
          <ActionButton
            color="accent"
            label="Añadir comida"
            onPress={() => router.push('/meals/add-meal')}
          />
        </View>
        <ConfirmationModal
          isVisible={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          handleConfirm={deleteMealsForToday}
          message="¿Estás seguro de que quieres borrar todas las comidas registradas para hoy? Esta acción no se puede deshacer."
        />
      </View>
    </Screen>
  );
}
