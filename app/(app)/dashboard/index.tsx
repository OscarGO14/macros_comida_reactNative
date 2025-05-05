import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import DoughnutChart from '@/components/DoughnutChart';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import BarChartComponent from '@/components/BarChart';
import { getDayOfWeek } from '@/utils/getDayOfWeek';
import Screen from '@/components/ui/Screen';
import SettingsItem from '@/components/ui/SettingsItem';
import { SettingsControlType } from '@/components/ui/SettingsItem/types';

export default function HomeScreen() {
  // TODO: CREAR Graficos resumen
  // TODO: CREAR pantalla histórico
  const router = useRouter();
  const [objective, setObjective] = useState<number | undefined>(undefined);
  const [consumed, setConsumed] = useState<number | undefined>(undefined);
  const { user } = useUserStore();

  const handlePreview = () => {
    router.push('/(app)/dashboard/preview');
  };

  const handleHistoric = () => {
    router.push('/(app)/dashboard/history');
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
        {objective !== undefined && (
          <DoughnutChart
            data={{
              objective,
              consumed: consumed || 0,
            }}
          />
        )}
        {!consumed && <Text className="text-primary">No hay datos de hoy...</Text>}

        {/* Grafico de días */}
        <BarChartComponent />
        <SettingsItem
          label="Ver historico"
          controlType={SettingsControlType.ARROW_ONLY}
          onPress={handleHistoric}
        />

        <SettingsItem
          label="Añadir comida"
          controlType={SettingsControlType.ARROW_ONLY}
          onPress={() => router.replace('/meals/add-meal')}
        />
      </View>
    </Screen>
  );
}
