import React from 'react';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IngredientsScreen() {
  return (
    <SafeAreaView className="size-full bg-background">
      <View className="flex-1 items-center justify-center gap-4">
        <Text className="text-primary text-2xl font-bold">Gestor de Ingredientes</Text>
        <Button
          title="Ver Ingredientes disponibles"
          onPress={() => router.push('/ingredients/ingredients-detail')}
        />
        {/* Boton para ir a vista de añadir ingredientes */}
        <Button
          title="Añadir Ingrediente nuevo"
          onPress={() => router.push('/ingredients/add-ingredient')}
        />
      </View>
    </SafeAreaView>
  );
}
