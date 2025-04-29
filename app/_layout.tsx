import { Stack } from 'expo-router';

// Root layout component using Stack Navigator
export default function RootLayout() {
  return (
    <Stack>
      {/* Configure screens here. The 'index' screen is automatically added */}
      {/* Example: <Stack.Screen name="index" options={{ title: 'Inicio' }} /> */}
       <Stack.Screen name="index" options={{ headerShown: false }} /> 
      {/* Add other screens or groups as needed */}
    </Stack>
  );
}
