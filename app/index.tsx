import React from 'react';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import Icon from '@/components/Icon';

export default function HomeScreen() {
  return (
    <SafeAreaView className="size-full bg-black">
      <View className="flex-1 items-center justify-center">
        <StatusBar style="dark" />
        <Text className="text-yellow-400 text-2xl font-bold mb-4">Calculadora de Macros</Text>
        <TouchableOpacity
          className="bg-yellow-400 px-6 py-3 rounded-full mb-4"
          onPress={() => router.push('/ingredients')}
        >
          <Text className="text-black font-bold">Ver Ingredientes</Text>
        </TouchableOpacity>
        {/* Boton para ir a vista de añadir ingredientes */}
        <TouchableOpacity
          className="bg-white px-6 py-3 rounded-full"
          onPress={() => router.push('/add-ingredient')}
        >
          <Text className="text-black font-bold">Añadir Ingrediente</Text>
        </TouchableOpacity>
        {/* Icono de prueba */}
        <Icon name="airplane" />
      </View>
    </SafeAreaView>
  );
}
