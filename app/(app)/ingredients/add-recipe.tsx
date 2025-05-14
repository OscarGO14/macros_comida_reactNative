import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Keyboard, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';

import { db, recipesCollection } from '@/services/firebase';
import { useUserStore } from '@/store/userStore';
import { Ingredient } from '@/types/ingredient';
import { Macros } from '@/types/macros';
import SearchItemModal from '@/components/SearchItemModal';
import { SearchableItem } from '@/components/SearchItemModal/types';
import Screen from '@/components/ui/Screen';
import SubmitButton from '@/components/ui/SubmitButton';
import InputText from '@/components/ui/InputText';
import ActionButton from '@/components/ui/ActionButton';
import Item from '@/components/ui/Item';
import { ItemType } from '@/components/ui/Item/types';
import { StatsCard } from '@/components/ui/StatsCard';
import Toast from 'react-native-toast-message';
import { Collections } from '@/types/collections';

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
    // Ocultar teclado antes de guardar
    Keyboard.dismiss();

    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Debes iniciar sesión para guardar recetas.',
      });
      return;
    }

    const userId = user.uid;
    const numServes = parseInt(serves, 10) || 1; // Asegurar que serves es número

    if (name.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'El nombre de la receta no puede estar vacío.',
      });
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

      Toast.show({
        type: 'success',
        text1: 'Receta',
        text2: 'Receta guardada correctamente.',
      });
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push('/(app)/recipes');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Error al guardar la receta. Inténtalo de nuevo. Error: ${error}`,
      });
    } finally {
      setLoading(false);
      // Volver al listado de recetas
      router.back();
    }
  };

  // Wrapper para onSelectItem
  const handleSelectItemWrapper = (item: SearchableItem, quantity: number) => {
    if ('calories' in item) {
      handleIngredientSelected(item as Ingredient, quantity);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error inesperado',
        text2: 'Se intentó añadir un tipo de item incorrecto.',
      });
    }
  };

  // Manejador para ocultar el teclado cuando se toca fuera de un input
  const handleTouchOutside = () => {
    Keyboard.dismiss();
  };

  // Función para resetear scroll en web cuando input pierde el foco
  const handleInputBlur = () => {
    if (Platform.OS === 'web') {
      // Ayuda a prevenir problemas de scroll en web
      window.scrollTo(0, 0);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View onTouchStart={handleTouchOutside} className="justify-center gap-4 pb-20">
          {/* Nombre de la receta */}
          <InputText
            label="Nombre de la receta"
            placeholder="Ej: Lentejas de la abuela"
            value={name}
            onChangeText={setName}
            autoCapitalize="sentences"
            onBlur={handleInputBlur}
          />

          <View className="mb-4">
            <Text className="text-m font-semibold mb-2 text-primary">Lista de ingredientes:</Text>
            <View className="h-60 min-h-28">
              {selectedIngredientsData.length === 0 ? (
                <Text className="text-alternate italic text-center p-4">
                  Añade ingredientes a tu receta
                </Text>
              ) : (
                <FlatList
                  data={selectedIngredientsData}
                  keyExtractor={(item) => item.ingredient.id}
                  renderItem={({ item }) => (
                    <Item
                      name={item.ingredient.name}
                      calories={item.ingredient.calories}
                      type={ItemType.INGREDIENT}
                      onDelete={() => removeIngredient(item.ingredient.id)}
                      showType={false}
                    />
                  )}
                  ListEmptyComponent={
                    <Text className="text-center text-alternate italic">No hay ingredientes</Text>
                  }
                />
              )}
            </View>
            <ActionButton
              onPress={() => {
                Keyboard.dismiss();
                setIsModalVisible(true);
              }}
              label="Añadir ingrediente"
              disabled={isModalVisible}
            />
          </View>
          {/* Input para raciones */}
          <InputText
            label="Raciones por receta"
            placeholder="Ej: 2 (para cuántas comidas rinde)"
            value={serves}
            onChangeText={setServes}
            keyboardType="number-pad"
            onBlur={handleInputBlur}
          />
          {/* Macros de la receta */}
          <StatsCard
            title="Macros por ración"
            value={currentMacros.calories.toFixed(0)}
            variant="primary"
            trend={[
              `P: ${currentMacros.proteins.toFixed(1)}`,
              `C: ${currentMacros.carbs.toFixed(1)}`,
              `G: ${currentMacros.fats.toFixed(1)}`,
            ]}
          />
          {/* Botón de guardar con margen inferior adicional */}

          <SubmitButton
            label={loading ? 'Guardando...' : 'Guardar receta'}
            onPress={handleSaveRecipe}
            disabled={loading}
          />

          <SearchItemModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onSelectItem={handleSelectItemWrapper}
            itemTypes={['ingredient']}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
