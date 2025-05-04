import React, { useEffect, useState } from 'react';
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
import { useRecipes } from '@/hooks/useRecipes';
import { Ingredient } from '@/types/ingredient';
import { Recipe } from '@/types/recipe';
import { Macros } from '@/types/macros';
import { ConsumedItem } from '@/types/history';
import Button from '@/components/ui/Button';
import { MyColors } from '@/types/colors';
import { useUserStore } from '@/store/userStore';
import { dailyLogCalculator } from '@/utils/dailyLogCalculator';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { getDayOfWeek } from '@/utils/getDayOfWeek';
import { StatsCard } from '@/components/ui/StatsCard';
import SubmitButton from '@/components/ui/SubmitButton';
import Item from '@/components/ui/Item';
import { ItemType } from '@/components/ui/Item/types';
import Screen from '@/components/ui/Screen';

// Tipo unificado para resultados de búsqueda
type SearchResult = (Ingredient & { itemType: 'ingredient' }) | (Recipe & { itemType: 'recipe' });

const AddMealScreen = () => {
  // TODO: reestilar con componentes nuevos
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
        fats: (selectedSearchResult.fats * quantityNum) / 100,
      };
    } else {
      calculatedMacros = {
        calories: selectedSearchResult.macros.calories * quantityNum,
        proteins: selectedSearchResult.macros.proteins * quantityNum,
        carbs: selectedSearchResult.macros.carbs * quantityNum,
        fats: selectedSearchResult.macros.fats * quantityNum,
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
  const totalMealMacrosCalc = currentMealItems.reduce(
    (acc, item) => {
      acc.calories += item.macros.calories;
      acc.proteins += item.macros.proteins;
      acc.carbs += item.macros.carbs;
      acc.fats += item.macros.fats;
      return acc;
    },
    { calories: 0, proteins: 0, carbs: 0, fats: 0 },
  );

  // Función para eliminar un item de la comida actual
  const handleDeleteItem = (indexToDelete: number) => {
    const updatedItems = currentMealItems.filter((_, index) => index !== indexToDelete);
    setCurrentMealItems(updatedItems);
  };

  // Función para renderizar cada ítem de la comida actual
  const renderMealItem = ({ item, index }: { item: ConsumedItem; index: number }) => {
    return (
      <View className="mb-2">
        <Item
          name={item.name}
          type={item.itemType as (typeof ItemType)[keyof typeof ItemType]}
          calories={Math.round(item.macros.calories)}
          showType={true}
          onDelete={() => handleDeleteItem(index)}
        />
      </View>
    );
  };

  const handleSaveMeal = async () => {
    if (currentMealItems.length === 0) {
      Alert.alert('Error', 'No has añadido ningún alimento a la comida.');
      return;
    }

    const today = getDayOfWeek();
    let dailyLog = user?.history?.[today];

    // Añadir la comida a la lista de comidas del día actual
    if (user) {
      dailyLog = dailyLogCalculator(dailyLog, currentMealItems, totalMealMacrosCalc);

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
    <Screen>
      <View className="flex-1 justify-between py-2">
        {/* Buscador */}
        <View className="items-center mb-4">
          <TextInput
            placeholder="Buscar ingrediente o receta..."
            value={searchTerm}
            onChangeText={handleSearch}
            className="border border-input rounded-md p-3 text-primary bg-card text-base"
            placeholderTextColor={MyColors.ALTERNATE}
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
              placeholderTextColor={MyColors.ALTERNATE}
            />
            <Button title="Añadir a la comida" onPress={handleAddItemToMeal} />
          </View>
        )}

        {/* Lista de items en la comida actual */}
        <View className="flex max-h-60">
          <FlatList
            data={currentMealItems}
            keyExtractor={(item, index) => `${item.itemId}-${index}`}
            renderItem={renderMealItem}
            ListEmptyComponent={
              <Text className="text-center text-alternate italic">Aún no has añadido nada.</Text>
            }
            className="flex-grow mb-4"
          />
        </View>
        {/* Total Macros y Guardar */}

        <StatsCard
          title="Macros comida actual"
          value={totalMealMacrosCalc.calories.toFixed(0)}
          variant="primary"
          trend={[
            `p: ${totalMealMacrosCalc.proteins.toFixed(1)}`,
            `c: ${totalMealMacrosCalc.carbs.toFixed(1)}`,
            `g: ${totalMealMacrosCalc.fats.toFixed(1)}`,
          ]}
        />

        <SubmitButton label="Guardar Comida" onPress={handleSaveMeal} />
      </View>
    </Screen>
  );
};

export default AddMealScreen;
