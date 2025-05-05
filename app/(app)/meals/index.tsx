import React, { useEffect, useMemo, useState } from 'react';
import Screen from '@/components/ui/Screen';
import { FlatList, Text, View } from 'react-native';
import { SettingsControlType } from '@/components/ui/SettingsItem/types';
import SettingsItem from '@/components/ui/SettingsItem';
import { router } from 'expo-router';
import { ConsumedItem, Meal } from '@/types/meal';
import { StatsCard } from '@/components/ui/StatsCard';
import { useUserStore } from '@/store/userStore';
import { getDayOfWeek } from '@/utils/getDayOfWeek';
import ActionButton from '@/components/ui/ActionButton';

export default function MealsScreen() {
  // TODO: Crear pantalla de comidas.
  const { user } = useUserStore();
  const [meals, setMeals] = useState<Meal[]>([]);

  const today = useMemo(() => getDayOfWeek(), []);

  const deleteMeals = () => {};

  useEffect(() => {
    if (user?.history) {
      setMeals(user.history[today]?.meals ?? []);
    }
  }, [user]);

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
            keyExtractor={(index, _item) => index.toString()}
          />
        ) : (
          <Text className="text-primary text-2xl font-bold text-center mb-6">No hay comidas</Text>
        )}
        <ActionButton label="Añadir comida" onPress={() => router.push('/meals/add-meal')} />
      </View>
    </Screen>
  );
}
