import React, { useEffect, useMemo, useState } from 'react';
import Screen from '@/components/ui/Screen';
import { FlatList, Text, View, Alert } from 'react-native';
import { router } from 'expo-router';
import { Meal } from '@/types/meal';
import { StatsCard } from '@/components/ui/StatsCard';
import { useUserStore } from '@/store/userStore';
import { getDayOfWeek } from '@/utils/getDayOfWeek';
import ActionButton from '@/components/ui/ActionButton';
import { doc, updateDoc, Timestamp } from 'firebase/firestore'; // Import Timestamp
import { db } from '@/services/firebase';
import { DailyLog } from '@/types/history'; // Import DailyLog desde la ruta correcta

// Función para crear un DailyLog vacío para el día actual
// Esto asegura que el campo 'date' se establezca al momento de la acción.
const createEmptyDailyLog = (): DailyLog => ({
  date: Timestamp.now(), // Fecha y hora actual para el registro reseteado
  meals: [],
  totalMacros: { calories: 0, proteins: 0, carbs: 0, fats: 0 },
});

export default function MealsScreen() {
  const { user, updateUserData } = useUserStore();
  const [meals, setMeals] = useState<Meal[]>([]);

  const today = useMemo(() => getDayOfWeek(), []);

  const deleteMealsForToday = async () => {
    if (!user) {
      Alert.alert('Error', 'Usuario no encontrado.');
      return;
    }

    Alert.alert(
      'Confirmar Borrado',
      '¿Estás seguro de que quieres borrar todas las comidas registradas para hoy? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: async () => {
            try {
              const emptyLog = createEmptyDailyLog(); // Crear el log vacío con la fecha actual

              // Actualizar Firestore para restablecer el log del día
              await updateDoc(doc(db, 'users', user.uid), {
                [`history.${today}`]: emptyLog,
              });

              // Actualizar contexto de Zustand
              const updatedHistory = { ...user.history };
              updatedHistory[today] = emptyLog;

              updateUserData({
                ...user,
                history: updatedHistory,
              });

              Alert.alert('Éxito', 'Se han borrado las comidas de hoy.');
            } catch (error) {
              console.error('Error al borrar las comidas de hoy:', error);
              Alert.alert(
                'Error',
                'No se pudo borrar el registro de hoy. Por favor, intenta de nuevo.',
              );
            }
          },
        },
      ],
    );
  };

  useEffect(() => {
    if (user?.history && user.history[today]) {
      setMeals(user.history[today]?.meals ?? []);
    } else {
      setMeals([]);
    }
  }, [user, today]);

  // Calcula los macros totales del día desde user.history[today].totalMacros
  const dailyTotalMacros = useMemo(() => {
    if (user?.history && user.history[today]) {
      return user.history[today].totalMacros;
    }
    return { calories: 0, proteins: 0, carbs: 0, fats: 0 }; // Valores por defecto
  }, [user, today]);

  return (
    <Screen>
      <View className="flex-col flex-1 justify-between py-4">
        {meals ? (
          <FlatList
            data={meals}
            renderItem={({ index, item }) => (
              <View className="mb-2">
                <StatsCard
                  title={`Comida ${index + 1}`}
                  value={dailyTotalMacros.calories}
                  trend={[
                    `P: ${dailyTotalMacros.proteins.toFixed(1)}`,
                    `C: ${dailyTotalMacros.carbs.toFixed(1)}`,
                    `G: ${dailyTotalMacros.fats.toFixed(1)}`,
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
            keyExtractor={(index, _item) => index.toString()}
          />
        ) : (
          <Text className="text-primary text-2xl font-bold text-center mb-6">No hay comidas</Text>
        )}
        <View className="flex-row justify-between">
          <ActionButton label="Borrar comidas" onPress={deleteMealsForToday} />
          <ActionButton
            color="accent"
            label="Añadir comida"
            onPress={() => router.push('/meals/add-meal')}
          />
        </View>
      </View>
    </Screen>
  );
}
