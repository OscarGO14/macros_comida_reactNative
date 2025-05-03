import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DoughnutChart from '@/components/DoughnutChart';
import Button from '@/components/ui/SubmitButton/Button';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import BarChartComponent from '@/components/BarChart';
import { getDayOfWeek } from '@/utils/getDayOfWeek';

export default function HomeScreen() {
  const router = useRouter();
  const [objective, setObjective] = useState<number | undefined>(undefined);
  const [consumed, setConsumed] = useState<number | undefined>(undefined);
  const { user } = useUserStore();

  const handleAddMeal = () => {
    router.push('/(app)/dashboard/add-meal');
  };
  // Loggea informacion del usuario
  useEffect(() => {
    if (user) {
      const today = getDayOfWeek();
      const todayHistory = user?.history?.[today];
      setObjective(user?.dailyGoals?.calories ?? undefined);
      setConsumed(todayHistory?.totalMacros?.calories ?? undefined);
    }
  }, [user]);

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
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
        {/* Grafico de días */}
        <BarChartComponent />
        <View>
          <Button title="Añadir Comida" onPress={handleAddMeal} />
        </View>
      </View>
    </SafeAreaView>
  );
}
