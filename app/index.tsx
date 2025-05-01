import React from 'react';
import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View>
        <Text className="color-red-500">Home Screen</Text>
        <Button title="Go to Ingredients" onPress={() => router.push('/ingredients')} />
      </View>
    </SafeAreaView>
  );
}
