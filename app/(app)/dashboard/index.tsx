import React, { useEffect, useMemo, useState } from 'react';
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
  const router = useRouter();
  const [objective, setObjective] = useState<number | undefined>(undefined);
  const [consumed, setConsumed] = useState<number | undefined>(undefined);
  const { user } = useUserStore();
  const today = useMemo(() => getDayOfWeek(), []);

  useEffect(() => {
    if (user) {
      const today = getDayOfWeek();
      // Comprobar que todayHistory es el de hoy y no el de la semana pasada.

      const todayHistory = user?.history?.[today];
      setObjective(user?.dailyGoals?.calories ?? undefined);
      setConsumed(todayHistory?.totalMacros?.calories ?? undefined);
    }
  }, [user]);

  return (
    <Screen>
      <View className="flex-col flex-1 items-center justify-evenly gap-4">
        <View className="flex items-center justify-center">
          <Text className="text-xl text-primary text-center py-4">
            Hola {user?.displayName || 'colega'}
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
        {user && (
          <BarChartComponent
            history={user.history}
            today={today}
            dailyGoal={user.dailyGoals?.calories}
          />
        )}

        <SettingsItem
          label="Añadir comida"
          controlType={SettingsControlType.ARROW_ONLY}
          onPress={() => router.replace('/meals/add-meal')}
        />
      </View>
    </Screen>
  );
}
