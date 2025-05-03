import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import DoughnutChart from '@/components/DoughnutChart';
import Button from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import BarChartComponent from '@/components/BarChart';
import { getDayOfWeek } from '@/utils/getDayOfWeek';
import Screen from '@/components/ui/Screen';
import SettingsItem from '@/components/ui/SettingsItem';
import { SettingsControlType } from '@/components/ui/SettingsItem/types';

export default function HomeScreen() {
  const router = useRouter();
  const [objective, setObjective] = useState<number | undefined>(undefined);
  const [consumed, setConsumed] = useState<number | undefined>(undefined);
  const { user } = useUserStore();

  const handleAddMeal = () => {
    router.push('/(app)/dashboard/add-meal');
  };
  const handlePreview = () => {
    router.push('/(app)/dashboard/preview');
  };
  // Loggea informacion del usuario
  useEffect(() => {
    if (user) {
      const today = getDayOfWeek();
      const todayHistory = user?.history?.[today];
      setObjective(user?.dailyGoals?.calories ?? undefined);
      console.log('Objective:', objective);
      console.log('Today:', today);
      console.log('Today History:', todayHistory); // Agrega este log para verificar el objet

      setConsumed(todayHistory?.totalMacros?.calories ?? undefined);
      console.log('User:', user);
    }
  }, [user]);

  return (
    <Screen>
      <View className="flex-col flex-1 items-center justify-center gap-4">
        <View className="flex items-center justify-center">
          <Text className="text-2xl text-primary text-center p-4">
            Hola {user?.displayName || 'colega'} estas son tus estadísticas:
          </Text>
        </View>
        {objective !== undefined && consumed !== undefined && (
          <DoughnutChart
            data={{
              objective,
              consumed,
            }}
          />
        )}
        {!consumed && <Text className="text-primary">No hay datos de hoy...</Text>}

        {/* Grafico de días */}
        <BarChartComponent />

        <SettingsItem
          label="Añadir Comida"
          controlType={SettingsControlType.ARROW_ONLY}
          onPress={handleAddMeal}
        />
        <SettingsItem
          label="Ir a preview de componentes"
          controlType={SettingsControlType.ARROW_ONLY}
          onPress={handlePreview}
        />
      </View>
    </Screen>
  );
}
