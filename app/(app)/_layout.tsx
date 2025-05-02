import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'react-native';

import { MyColors } from '@/types/colors';
import Icon from '@/components/Icon';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: MyColors.BLACK,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: MyColors.YELLOW,
        tabBarInactiveTintColor: MyColors.WHITE,
        headerShown: false,
      }}
    >
      <StatusBar barStyle="dark-content" />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => (
            <Icon name="home" size={24} color={focused ? MyColors.YELLOW : MyColors.WHITE} />
          ),
        }}
      />
      <Tabs.Screen
        name="ingredients"
        options={{
          title: 'Ingredientes',
          tabBarIcon: ({ focused }) => (
            <Icon name="list" size={24} color={focused ? MyColors.YELLOW : MyColors.WHITE} />
          ),
        }}
      />
      {/* settings */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configuración',
          tabBarIcon: ({ focused }) => (
            <Icon name="cog" size={24} color={focused ? MyColors.YELLOW : MyColors.WHITE} />
          ),
        }}
      />
    </Tabs>
  );
}
