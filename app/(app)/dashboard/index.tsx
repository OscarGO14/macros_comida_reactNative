import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DoughnutChart from '@/components/Doughnut';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleAddMeal = () => {
    router.push('/(app)/dashboard/add-meal');
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl text-primary mb-4">Resumen de hoy</Text>
        <DoughnutChart
          data={{
            todoTaskCount: 15,
            progressTaskCount: 40,
            completeTaskCount: 45,
          }}
        />
      </View>
      <View className="w-full mb-4">
        <Button title="Añadir Comida" onPress={handleAddMeal} />
      </View>
    </SafeAreaView>
  );
}
