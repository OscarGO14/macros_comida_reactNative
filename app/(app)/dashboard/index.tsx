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
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { createEmptyDailyLog } from '@/utils/createEmpytDailyLog';
import { isFromToday } from '@/utils/dateUtils';

export default function HomeScreen() {
  const router = useRouter();
  const [objective, setObjective] = useState<number | undefined>(undefined);
  const [consumed, setConsumed] = useState<number | undefined>(undefined);
  const { user, updateUserData } = useUserStore();
  const today = useMemo(() => getDayOfWeek(), []);

  useEffect(() => {
    const checkAndUpdateDailyLog = async () => {
      if (!user) return;

      const today = getDayOfWeek();
      const todayHistory = user.history?.[today];

      // Si no hay registro para hoy, o el registro no es de hoy
      if (!todayHistory || !isFromToday(todayHistory.date)) {
        // Crear un nuevo registro vacío para hoy
        const newDailyLog = createEmptyDailyLog();

        // Actualizar Firestore
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          [`history.${today}`]: newDailyLog,
        });

        // Actualizar el estado local
        updateUserData({
          ...user,
          history: {
            ...user.history,
            [today]: newDailyLog,
          },
        });

        // Actualizar el estado del componente
        setObjective(user.dailyGoals?.calories);
        setConsumed(0); // Nuevo día, consumo en 0
      } else {
        // Usar los datos existentes
        setObjective(user.dailyGoals?.calories);
        setConsumed(todayHistory.totalMacros?.calories);
      }
    };

    checkAndUpdateDailyLog();
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
