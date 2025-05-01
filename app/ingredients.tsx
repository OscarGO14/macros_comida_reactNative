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
    <SafeAreaView>
      <View className="flex">
        <StatusBar style="auto" />
        <View>
          <Text>Ingredients List:</Text>
        </View>
        <ScrollView className="">
          {ingredientsData.length > 0 ? (
            ingredientsData.map((ingredient) => (
              <Text key={ingredient.id}>
                {ingredient.name} - {ingredient.calories} kcal
              </Text>
            ))
          ) : (
            <Text>No ingredients found.</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
