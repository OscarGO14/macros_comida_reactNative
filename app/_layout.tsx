import React from 'react';
import { Stack } from 'expo-router';

import { MyColors } from '@/types/colors';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: MyColors.BLACK },
        headerTintColor: MyColors.WHITE,
        headerTitleStyle: { color: MyColors.YELLOW },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
