// This will be the home screen
// We will move the content from the old App.tsx here soon
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Text, View } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  // Vamos a hacer una vista simple con un boton para ir a la lista de ingredientes

  return (
    <View className="flex">
      <StatusBar style="auto" />
      <View className="flex-1 items-center justify-center">
        <Text>Home Screen</Text>
      </View>
      <Button title="Go to Ingredients" onPress={() => router.push('/ingredients')} />
    </View>
  );
}
