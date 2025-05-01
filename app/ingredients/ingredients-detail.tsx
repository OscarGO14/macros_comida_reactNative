import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useIngredients } from '@/hooks/useIngredients';

export default function IngredientsDetailScreen() {
  const {
    data: ingredientsData,
    loading: ingredientsLoading,
    error: ingredientsError,
  } = useIngredients();

  const findIngredient = (name: string) => {
    return ingredientsData.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(name.toLowerCase()),
    );
  };

  useEffect(() => {
    if (ingredientsData) {
      const foundIngredients = findIngredient('Helado');
      console.log('Ingredients data:', foundIngredients);
    }
  }, [ingredientsData]);

  if (ingredientsLoading) {
    return (
      <View>
        <Text className="text-base">Loading...</Text>
      </View>
    );
  }

  if (ingredientsError) {
    return (
      <View>
        <Text className="text-base">Error loading ingredients: {ingredientsError.message}</Text>
      </View>
    );
  }

  if (!ingredientsData) {
    return (
      <View>
        <Text className="text-base">No data available.</Text>
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
                <Text className="text-base text-black">
                  {ingredient.name} - {ingredient.calories} kcal
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-base">No ingredients found.</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
