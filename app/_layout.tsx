import React from 'react';
import { Stack } from 'expo-router';
import '../global.css';
// Root layout component using Stack Navigator
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
