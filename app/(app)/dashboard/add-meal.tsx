import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';

import { useIngredients } from '@/hooks/useIngredients';
import { useRecipes } from '@/hooks/useRecipes'; // Asumiendo que existe o se creará
import { Ingredient } from '@/types/ingredient';
import { Recipe } from '@/types/recipe';
import { Macros } from '@/types/macros';
import Button from '@/components/Button';
import { MyColors } from '@/types/colors'; // Importar colores para estilos

// Tipo unificado para resultados de búsqueda
type SearchResult = (Ingredient & { itemType: 'ingredient' }) | (Recipe & { itemType: 'recipe' });

const AddMealScreen = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedSearchResult, setSelectedSearchResult] = useState<SearchResult | null>(null);
  const [quantity, setQuantity] = useState('');
  const [currentMealItems, setCurrentMealItems] = useState<ConsumedItem[]>([]);
  const [mealName, setMealName] = useState('Desayuno'); // Opciones: Desayuno, Almuerzo, Cena, Snacks

  // Hooks para obtener datos (pueden necesitar ajustes)
  const { data: ingredients, loading: ingredientsLoading } = useIngredients();
  // const { data: recipes, loading: recipesLoading } = useRecipes(); // Descomentar cuando exista
  const recipes: Recipe[] = []; // Placeholder
  const recipesLoading = false; // Placeholder

  // Función de búsqueda (simplificada)
  const handleSearch = (text: string) => {
    setSearchTerm(text);
    setSelectedSearchResult(null); // Limpiar selección anterior
    setQuantity(''); // Limpiar cantidad

    if (text.length < 2) {
      setSearchResults([]);
      return;
    }

    const lowerCaseText = text.toLowerCase();

    // Filtrar ingredientes
    const filteredIngredients = ingredients
      .filter((ing) => ing.name.toLowerCase().includes(lowerCaseText))
      .map((ing) => ({ ...ing, itemType: 'ingredient' as const }));

    // Filtrar recetas (cuando esté disponible)
    // const filteredRecipes = recipes
    //   .filter((rec) => rec.name.toLowerCase().includes(lowerCaseText))
    //   .map((rec) => ({ ...rec, itemType: 'recipe' as const }));

    setSearchResults([...filteredIngredients /*, ...filteredRecipes*/]);
  };

  // Manejar selección de un resultado
  const handleSelectResult = (result: SearchResult) => {
    setSelectedSearchResult(result);
    setSearchTerm(result.name); // Poner el nombre en el input
    setSearchResults([]); // Ocultar resultados
  };

  // --- Lógica para calcular macros y añadir item (PENDIENTE) ---
  const handleAddItemToMeal = () => {
    if (!selectedSearchResult || !quantity) {
      Alert.alert('Error', 'Selecciona un alimento e introduce la cantidad.');
      return;
    }

    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      Alert.alert('Error', 'La cantidad debe ser un número positivo.');
      return;
    }

    // TODO: Calcular macros basado en selectedSearchResult y quantityNum
    const calculatedMacros: Macros = { calories: 0, proteins: 0, carbs: 0, fat: 0 }; // Placeholder

    const newItem: ConsumedItem = {
      itemId: selectedSearchResult.id,
      itemType: selectedSearchResult.itemType,
      name: selectedSearchResult.name,
      quantity: quantityNum,
      macros: calculatedMacros,
    };

    setCurrentMealItems((prevItems) => [...prevItems, newItem]);
    setSelectedSearchResult(null);
    setSearchTerm('');
    setQuantity('');
  };

  // --- Lógica para guardar la comida (PENDIENTE) ---
  const handleSaveMeal = () => {
    if (currentMealItems.length === 0) {
      Alert.alert('Error', 'No has añadido ningún alimento a la comida.');
      return;
    }
    // TODO: Implementar guardado en Firestore
    console.log('Guardando comida:', mealName, currentMealItems);
    Alert.alert('Éxito', 'Comida guardada (simulado).');
    // router.back(); // Volver atrás después de guardar
  };

  // Calcula macros totales de la comida actual
  const totalMealMacros = currentMealItems.reduce(
    (acc, item) => {
      acc.calories += item.macros.calories;
      acc.protein += item.macros.proteins;
      acc.carbs += item.macros.carbs;
      acc.fat += item.macros.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <Stack.Screen options={{ title: 'Añadir Comida' }} />
      <Text className="text-xl font-bold text-text mb-4">Añadir a: {mealName}</Text>

      {/* Buscador */}
      <View className="flex-1 items-center mb-4">
        <TextInput
          placeholder="Buscar ingrediente o receta..."
          value={searchTerm}
          onChangeText={handleSearch}
          className="border border-input rounded-md p-3 text-primary bg-card text-base"
          placeholderTextColor={MyColors.GREY}
        />
        {(ingredientsLoading || recipesLoading) && <ActivityIndicator className="mt-2" />}
        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => `${item.itemType}-${item.id}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectResult(item)}
                className="p-3 border-b border-border"
              >
                <Text className="text-primary text-base">
                  {item.name} ({item.itemType})
                </Text>
              </TouchableOpacity>
            )}
            className="max-h-60 border border-border rounded-md mt-1 bg-card"
          />
        )}
      </View>

      {/* Sección para añadir item seleccionado */}
      {selectedSearchResult && (
        <View className="mb-4 p-4 border border-border rounded-md bg-card">
          <Text className="text-lg text-primary font-semibold mb-2">
            Añadir: {selectedSearchResult.name}
          </Text>
          <TextInput
            placeholder={
              selectedSearchResult.itemType === 'ingredient' ? 'Gramos (gr)' : 'Raciones'
            }
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            className="border border-input rounded-md p-3 text-primary bg-card text-base mb-3"
            placeholderTextColor={MyColors.GREY}
          />
          <Button title="Añadir a la comida" onPress={handleAddItemToMeal} />
        </View>
      )}

      {/* Lista de items en la comida actual */}
      <Text className="text-lg font-semibold text-text mb-2">Comida Actual ({mealName})</Text>
      <FlatList
        data={currentMealItems}
        keyExtractor={(item, index) => `${item.itemId}-${index}`}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center p-3 border-b border-border bg-card mb-1 rounded">
            <Text className="text-primary text-base flex-1 mr-2">
              {item.name} ({item.quantity}
              {item.itemType === 'ingredient' ? 'g' : ' ración/es'})
            </Text>
            <Text className="text-alternate text-sm">
              C: {item.macros.calories.toFixed(0)} P: {item.macros.protein.toFixed(1)} Cb:{' '}
              {item.macros.carbs.toFixed(1)} G: {item.macros.fat.toFixed(1)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-alternate italic">Aún no has añadido nada.</Text>
        }
        className="flex-grow mb-4"
      />

      {/* Total Macros y Guardar */}
      <View className="flex-1 items-center border-t border-border pt-4">
        <Text className="text-lg font-semibold text-alternate mb-2">
          Macros Totales ({mealName})
        </Text>
        <Text className="text-alternate mb-1">
          Calorías: {totalMealMacros.calories.toFixed(0)} kcal
        </Text>
        <Text className="text-alternate mb-1">
          Proteína: {totalMealMacros.protein.toFixed(1)} g
        </Text>
        <Text className="text-alternate mb-1">
          Carbohidratos: {totalMealMacros.carbs.toFixed(1)} g
        </Text>
        <Text className="text-alternate mb-4">Grasa: {totalMealMacros.fat.toFixed(1)} g</Text>
        <Button title="Guardar Comida" onPress={handleSaveMeal} />
      </View>
    </SafeAreaView>
  );
};

export default AddMealScreen;
