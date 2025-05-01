import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useIngredients } from '@/hooks/useIngredients';

export default function IngredientsScreen() {
  const {
    data: ingredientsData,
    loading: ingredientsLoading,
    error: ingredientsError,
  } = useIngredients();

  if (ingredientsLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (ingredientsError) {
    return (
      <View>
        <Text>Error loading ingredients: {ingredientsError.message}</Text>
      </View>
    );
  }

  if (!ingredientsData) {
    return (
      <View>
        <Text>No data available.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-black">
      <View className="flex p-4">
        <StatusBar style="auto" />
        <View>
          <Text className="text-yellow-400 text-xl font-bold mb-4">Lista de Ingredientes</Text>
        </View>
        <ScrollView className="">
          {ingredientsData.length > 0 ? (
            ingredientsData.map((ingredient) => (
              <View key={ingredient.id} className="bg-white p-3 rounded-lg mb-2">
                <Text className="text-black">
                  {ingredient.name} - {ingredient.calories} kcal
                </Text>
              </View>
            ))
          ) : (
            <Text>No ingredients found.</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
