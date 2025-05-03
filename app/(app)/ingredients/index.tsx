import React from 'react';
import { router } from 'expo-router';
import SettingsItem from '@/components/ui/SettingsItem';
import { SettingsControlType } from '@/components/ui/SettingsItem/types';
import Screen from '@/components/ui/Screen';
import { View, Text } from 'react-native';

export default function IngredientsScreen() {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center gap-4">
        <Text className="text-primary text-2xl font-bold">Gestor de Ingredientes</Text>

        <SettingsItem
          label="Ver Ingredientes disponibles"
          controlType={SettingsControlType.ARROW_ONLY}
          onPress={() => router.push('/ingredients/ingredients-list')}
        />
        <SettingsItem
          label="Añadir Ingrediente nuevo"
          controlType={SettingsControlType.ARROW_ONLY}
          onPress={() => router.push('/ingredients/add-ingredient')}
        />
      </View>
    </Screen>
  );
}
