import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';

import { useIngredients } from '@/hooks/useIngredients';
import { useRecipes } from '@/hooks/useRecipes';
import { Ingredient } from '@/types/ingredient';
import { Recipe } from '@/types/recipe';
import { Macros } from '@/types/macros';
import Button from '@/components/Button';
import { MyColors } from '@/types/colors';
import { ConsumedItem, DayOfWeek } from '@/types/history';
import { useUserStore } from '@/store/userStore';
import { dailyLogCalculator } from '@/utils/dailyLogCalculator';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { getDayOfWeek } from '@/utils/getDayOfWeek';

// Tipo unificado para resultados de búsqueda
type SearchResult = (Ingredient & { itemType: 'ingredient' }) | (Recipe & { itemType: 'recipe' });

const AddMealScreen = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedSearchResult, setSelectedSearchResult] = useState<SearchResult | null>(null);
  const [quantity, setQuantity] = useState('');
  const [currentMealItems, setCurrentMealItems] = useState<ConsumedItem[]>([]);
  const { user, updateUserData } = useUserStore();

  // Hooks para obtener datos (pueden necesitar ajustes)
  const {
    data: ingredients,
    loading: ingredientsLoading,
    error: ingredientsError,
  } = useIngredients();
  const { data: recipes, loading: recipesLoading, error: recipesError } = useRecipes();

  // Función de búsqueda (simplificada)
  const handleSearch = (text: string) => {
    setSearchTerm(text);
    setSelectedSearchResult(null);
    setQuantity('');

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
    const filteredRecipes = recipes
      .filter((rec) => rec.name.toLowerCase().includes(lowerCaseText))
      .map((rec) => ({ ...rec, itemType: 'recipe' as const }));

    setSearchResults([...filteredIngredients, ...filteredRecipes]);
  };

  // Manejar selección de un resultado
  const handleSelectResult = (result: SearchResult) => {
    setSelectedSearchResult(result);
    setSearchTerm(result.name);
    setSearchResults([]);
  };

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
    let calculatedMacros: Macros;
    if (selectedSearchResult.itemType === 'ingredient') {
      calculatedMacros = {
        calories: (selectedSearchResult.calories * quantityNum) / 100,
        proteins: (selectedSearchResult.proteins * quantityNum) / 100,
        carbs: (selectedSearchResult.carbs * quantityNum) / 100,
        fat: (selectedSearchResult.fat * quantityNum) / 100,
      };
    } else {
      calculatedMacros = {
        calories: selectedSearchResult.macros.calories * quantityNum,
        proteins: selectedSearchResult.macros.proteins * quantityNum,
        carbs: selectedSearchResult.macros.carbs * quantityNum,
        fat: selectedSearchResult.macros.fat * quantityNum,
      };
    }

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

  // Calcula macros totales de la comida actual
  const totalMealMacros = currentMealItems.reduce(
    (acc, item) => {
      acc.calories += item.macros.calories;
      acc.proteins += item.macros.proteins;
      acc.carbs += item.macros.carbs;
      acc.fat += item.macros.fat;
      return acc;
    },
    { calories: 0, proteins: 0, carbs: 0, fat: 0 },
  );
  const handleSaveMeal = async () => {
    if (currentMealItems.length === 0) {
      Alert.alert('Error', 'No has añadido ningún alimento a la comida.');
      return;
    }

    const today = getDayOfWeek();
    let dailyLog = user?.history?.[today];

    // Añadir la comida a la lista de comidas del día actual
    if (user) {
      dailyLog = dailyLogCalculator(dailyLog, currentMealItems, totalMealMacros);

      // Update user in userStore
      updateUserData({
        ...user,
        history: {
          ...user.history,
          [today]: dailyLog,
        },
      });
      // Update user in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        history: {
          [today]: dailyLog,
        },
      });
    } else {
      Alert.alert('Error', 'No se pudo actualizar el historial de comidas.');
    }

    router.back();
  };

  useEffect(() => {
    if (ingredientsError || recipesError) {
      Alert.alert('Error', 'Error al cargar ingredientes o recetas.');
    }
  }, [ingredientsError, recipesError]);

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <Stack.Screen options={{ title: 'Añadir Comida' }} />

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
      <ScrollView className="flex max-h-60">
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
                C: {item.macros.calories.toFixed(0)} P: {item.macros.proteins.toFixed(1)} Cb:{' '}
                {item.macros.carbs.toFixed(1)} G: {item.macros.fat.toFixed(1)}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-center text-alternate italic">Aún no has añadido nada.</Text>
          }
          className="flex-grow mb-4"
        />
      </ScrollView>
      {/* Total Macros y Guardar */}
      <View className="flex-1 items-center border-t border-border pt-4">
        <Text className="text-lg font-semibold text-alternate mb-2">Macros comida actual</Text>
        <Text className="text-alternate mb-1">
          Calorías: {totalMealMacros.calories.toFixed(0)} kcal
        </Text>
        <Text className="text-alternate mb-1">
          Proteína: {totalMealMacros.proteins.toFixed(1)} g
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
