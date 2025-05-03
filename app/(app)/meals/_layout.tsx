import { Stack } from 'expo-router';
import { MyColors } from '@/types/colors';

export default function RecipesStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: MyColors.BACKGROUND },
        headerTintColor: MyColors.PRIMARY,
        headerTitleStyle: { color: MyColors.ACCENT },
        headerShown: true,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Mis comidas' }} />
      <Stack.Screen name="add-meal" options={{ title: 'Añadir comida' }} />
    </Stack>
  );
}
