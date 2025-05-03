import { Stack } from 'expo-router';
import { MyColors } from '@/types/colors';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: MyColors.BACKGROUND },
        headerTintColor: MyColors.PRIMARY,
        headerTitleStyle: { color: MyColors.ACCENT },
        headerShown: true,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Configuración' }} />
      <Stack.Screen name="updateUser" options={{ title: 'Actualizar usuario' }} />
    </Stack>
  );
}
