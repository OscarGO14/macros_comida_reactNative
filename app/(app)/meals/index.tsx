import React from 'react';
import Screen from '@/components/ui/Screen';
import { Text } from 'react-native';
import { SettingsControlType } from '@/components/ui/SettingsItem/types';
import SettingsItem from '@/components/ui/SettingsItem';
import { router } from 'expo-router';

export default function MealsScreen() {
  // TODO: Crear pantalla de comidas.
  return (
    <Screen>
      <Text className="text-primary text-2xl font-bold text-center mb-6">Mis comidas</Text>
      <SettingsItem
        label="Añadir comida"
        controlType={SettingsControlType.ARROW_ONLY}
        onPress={() => router.push('/meals/add-meal')}
        iconName="fruit-cherries"
      />
    </Screen>
  );
}
