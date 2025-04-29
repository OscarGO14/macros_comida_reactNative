import React from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import useCollection from "@/hooks/useCollection";
import Collections from "@/types/collections";

export default function IngredientsScreen() {
  const {
    data: ingredientsData,
    loading: ingredientsLoading,
    error: ingredientsError,
  } = useCollection(Collections.ingredients);

  if (ingredientsLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (ingredientsError) {
    return (
      <View style={styles.container}>
        <Text>Error loading ingredients: {ingredientsError.message}</Text>
      </View>
    );
  }

  if (!ingredientsData) {
    return (
      <View style={styles.container}>
        <Text>No data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View>
        <Text>Ingredients List:</Text>
      </View>
      <ScrollView>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
});
