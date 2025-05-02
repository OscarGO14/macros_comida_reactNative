import { Stack } from 'expo-router';
import { MyColors } from '@/types/colors';

export default function IngredientsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: MyColors.BLACK },
        headerTintColor: MyColors.WHITE,
        headerTitleStyle: { color: MyColors.YELLOW },
        headerShown: true,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Ingredientes' }} />
      <Stack.Screen name="add-ingredient" options={{ title: 'Añadir ingrediente' }} />
      <Stack.Screen name="ingredients-list" options={{ title: 'Lista de ingredientes' }} />
    </Stack>
  );
}
