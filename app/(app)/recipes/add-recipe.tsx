import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';

import { db, recipesCollection, Collections } from '@/services/firebase';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/Button';
import { Ingredient } from '@/types/ingredient';
import { Macros } from '@/types/macros';
import IngredientsModal from '@/components/IngredientsModal';
import Screen from '@/components/ui/Screen';

interface SelectedIngredientData {
  ingredient: Ingredient;
  quantity: number;
}

export default function AddRecipeScreen() {
  const router = useRouter();
  const { user } = useUserStore();

  const [name, setName] = useState<string>('');
  const [selectedIngredientsData, setSelectedIngredientsData] = useState<SelectedIngredientData[]>(
    [],
  );
  const [serves, setServes] = useState<string>('1');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Estado para macros calculadas en tiempo real
  const initialMacros: Macros = {
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0,
  };
  const [currentMacros, setCurrentMacros] = useState<Macros>(initialMacros);

  const handleIngredientSelected = (ingredient: Ingredient, quantity: number) => {
    const newSelectedIngredientData: SelectedIngredientData = {
      ingredient,
      quantity,
    };

    setSelectedIngredientsData((prev) => [...prev, newSelectedIngredientData]);
    setIsModalVisible(false);
  };

  const removeIngredient = (ingredientIdToRemove: string) => {
    setSelectedIngredientsData((prev) =>
      prev.filter((item) => item.ingredient.id !== ingredientIdToRemove),
    );
  };

  // Función para calcular las macros por ración
  const calculateRecipeMacros = (
    ingredientsData: SelectedIngredientData[],
    numServes: number,
  ): Macros => {
    const totalMacros: Macros = { calories: 0, proteins: 0, carbs: 0, fats: 0 };

    ingredientsData.forEach((item) => {
      const quantityFactor = item.quantity / 100; // Factor basado en 100g
      const ingredient = item.ingredient;
      totalMacros.calories += (ingredient.calories || 0) * quantityFactor;
      totalMacros.proteins += (ingredient.proteins || 0) * quantityFactor;
      totalMacros.carbs += (ingredient.carbs || 0) * quantityFactor;
      totalMacros.fats += (ingredient.fats || 0) * quantityFactor;
    });

    // Calcular macros por ración
    const macrosPerServing: Macros = {
      calories: totalMacros.calories / numServes,
      proteins: totalMacros.proteins / numServes,
      carbs: totalMacros.carbs / numServes,
      fats: totalMacros.fats / numServes,
    };

    // Redondear a 2 decimales (opcional)
    Object.keys(macrosPerServing).forEach((key) => {
      macrosPerServing[key as keyof Macros] = parseFloat(
        macrosPerServing[key as keyof Macros].toFixed(2),
      );
    });

    return macrosPerServing;
  };

  // useEffect para recalcular macros cuando cambian ingredientes o raciones
  useEffect(() => {
    const numServes = parseInt(serves, 10) || 1; // Usar valor parseado o 1
    if (selectedIngredientsData.length > 0) {
      const calculated = calculateRecipeMacros(selectedIngredientsData, numServes);
      setCurrentMacros(calculated);
    } else {
      // Resetear si no hay ingredientes
      setCurrentMacros(initialMacros);
    }
  }, [selectedIngredientsData, serves]);

  /**
   * Función para guardar la receta en la base de datos.
   */
  const handleSaveRecipe = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para guardar recetas.');
      return;
    }

    const userId = user.uid;
    const numServes = parseInt(serves, 10) || 1; // Asegurar que serves es número

    if (name.trim() === '') {
      Alert.alert('Error', 'El nombre de la receta no puede estar vacío.');
      return;
    }

    setLoading(true);

    // Usar macros del estado en lugar de recalcular aquí
    const newRecipeData = {
      userId,
      name: name.trim(),
      ingredients: selectedIngredientsData.map((item) => ({
        ingredientId: item.ingredient.id,
        quantity: item.quantity,
      })),
      macros: currentMacros, // Usar macros del estado
      serves: numServes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      // 3. Guardar en colección 'RECIPES'
      const newRecipeRef = await addDoc(recipesCollection, newRecipeData);
      console.log('Receta guardada con ID:', newRecipeRef.id);

      // 4. Actualizar 'customRecipeIds' en el documento del usuario
      const userDocRef = doc(db, Collections.USERS, userId);
      await updateDoc(userDocRef, {
        customRecipeIds: arrayUnion(newRecipeRef.id),
      });

      Alert.alert('Éxito', 'Receta guardada correctamente.');
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/(app)/recipes');
      }
    } catch (error) {
      console.error('Error guardando receta:', error);
      Alert.alert('Error', 'No se pudo guardar la receta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
      // Volver al listado de recetas
      router.back();
    }
  };

  return (
    <Screen>
      <ScrollView className="p-4">
        <Text className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Añadir Nueva Receta
        </Text>

        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Nombre de la Receta
          </Text>
          <TextInput
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Ej: Lentejas de la abuela"
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={setName}
            autoCapitalize="sentences"
          />
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Añade ingredientes a tu receta
          </Text>
          <View className="bg-input border border-border rounded-md p-2 min-h-[100px] mb-2">
            {selectedIngredientsData.length === 0 ? (
              <Text className="text-text-secondary italic text-center p-4">
                Añade ingredientes a tu receta
              </Text>
            ) : (
              <FlatList
                data={selectedIngredientsData}
                keyExtractor={(item) => item.ingredient.id}
                renderItem={({ item }) => (
                  <View className="flex-row justify-between items-center p-2 border-b border-gray-200">
                    <Text className="text-gray-800 flex-1">
                      {`${item.ingredient.name} (${item.quantity} g)`}
                    </Text>
                    <TouchableOpacity onPress={() => removeIngredient(item.ingredient.id)}>
                      <Text className="text-red-500 font-bold">Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                )}
                ListEmptyComponent={
                  <Text className="text-center text-gray-500 italic">No hay ingredientes</Text>
                }
              />
            )}
          </View>
          <Button title="Añadir Ingrediente" onPress={() => setIsModalVisible(true)} />
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Raciones por Receta
          </Text>
          <TextInput
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Ej: 2 (para cuántas comidas rinde)"
            placeholderTextColor="#6b7280"
            value={serves}
            onChangeText={setServes}
            keyboardType="number-pad"
          />
        </View>

        {/* Mostrar Macros Calculadas */}
        {selectedIngredientsData.length > 0 && (
          <View className="my-4 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
            <Text className="text-lg font-semibold mb-2 text-center text-gray-700 dark:text-gray-300">
              Macros por Ración (Aprox.)
            </Text>
            <View className="flex-row justify-around">
              <Text className="text-gray-800 dark:text-gray-200">
                Cal: {currentMacros.calories.toFixed(0)}
              </Text>
              <Text className="text-gray-800 dark:text-gray-200">
                P: {currentMacros.proteins.toFixed(1)}g
              </Text>
              <Text className="text-gray-800 dark:text-gray-200">
                C: {currentMacros.carbs.toFixed(1)}g
              </Text>
              <Text className="text-gray-800 dark:text-gray-200">
                G: {currentMacros.fats.toFixed(1)}g
              </Text>
            </View>
          </View>
        )}

        <View className="mt-6">
          <Button
            title={loading ? 'Guardando...' : 'Guardar Receta'}
            onPress={handleSaveRecipe}
            disabled={loading}
          />
        </View>
      </ScrollView>

      <IngredientsModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectIngredient={handleIngredientSelected}
      />
    </Screen>
  );
}
