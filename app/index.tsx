import React from 'react';
import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
export default function HomeScreen() {
  return (
    <SafeAreaView className="size-full bg-slate-700">
      <View className="flex-1 items-center justify-center">
        <StatusBar style="auto" />
        <Text className="text-white">Home Screen</Text>
        <Button title="Go to Ingredients" onPress={() => router.push('/ingredients')} />
        {/* Boton para ir a vista de añadir ingredientes */}
        <Button title="Add Ingredient" onPress={() => router.push('/add-ingredient')} />
      </View>
    </SafeAreaView>
  );
}
