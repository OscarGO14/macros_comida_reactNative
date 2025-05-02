import { Stack } from 'expo-router';
import { MyColors } from '@/types/colors';

export default function RecipesStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: MyColors.BLACK },
        headerTintColor: MyColors.WHITE,
        headerTitleStyle: { color: MyColors.YELLOW },
        headerShown: true,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Mis Recetas' }} />
      {/* Añadiremos la pantalla 'add' aquí cuando la creemos */}
      <Stack.Screen name="add" options={{ title: 'Añadir Receta' }} />
    </Stack>
  );
}
