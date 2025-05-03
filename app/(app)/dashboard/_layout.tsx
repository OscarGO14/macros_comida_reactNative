import { Stack } from 'expo-router';
import { MyColors } from '@/types/colors';

export default function DashboardStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: MyColors.BACKGROUND },
        headerTintColor: MyColors.PRIMARY,
        headerTitleStyle: { color: MyColors.ACCENT },
        headerShown: true,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Resumen de hoy' }} />
      <Stack.Screen name="add-meal" options={{ title: 'Añadir comida' }} />
      <Stack.Screen name="preview" options={{ title: 'Previsualizar' }} />
    </Stack>
  );
}
