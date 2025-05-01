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
    </Stack>
  );
}
