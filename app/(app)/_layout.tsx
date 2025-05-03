import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'react-native';

import { MyColors } from '@/types/colors';
import Icon from '@/components/ui/Icon';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: MyColors.BACKGROUND,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: MyColors.ACCENT,
        tabBarInactiveTintColor: MyColors.PRIMARY,
        headerShown: false,
      }}
    >
      <StatusBar barStyle="dark-content" />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => (
            <Icon name="home" size={24} color={focused ? MyColors.ACCENT : MyColors.PRIMARY} />
          ),
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: 'Mis comidas',
          tabBarIcon: ({ focused }) => (
            <Icon name="fast-food" size={24} color={focused ? MyColors.ACCENT : MyColors.PRIMARY} />
          ),
        }}
      />
      <Tabs.Screen
        name="ingredients"
        options={{
          title: 'Ingredientes',
          tabBarIcon: ({ focused }) => (
            <Icon name="list" size={24} color={focused ? MyColors.ACCENT : MyColors.PRIMARY} />
          ),
        }}
      />
      {/* settings */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configuración',
          tabBarIcon: ({ focused }) => (
            <Icon
              name="cog-outline"
              size={24}
              color={focused ? MyColors.ACCENT : MyColors.PRIMARY}
            />
          ),
        }}
      />
    </Tabs>
  );
}
