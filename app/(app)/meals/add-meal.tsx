import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  KeyboardAvoidingViewProps,
} from 'react-native';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'expo-router';
import Screen from '@/components/ui/Screen';
import { getDayOfWeek } from '@/utils/getDayOfWeek';
import { dailyLogCalculator } from '@/utils/dailyLogCalculator';
import { Ingredient } from '@/types/ingredient';
import { Recipe } from '@/types/recipe';
import { ConsumedItem, MealIngredient, MealRecipe } from '@/types/meal';
import Item from '@/components/ui/Item';
import { ItemType } from '@/components/ui/Item/types';
import SearchItemModal from '@/components/SearchItemModal';
import { SearchableItem } from '@/components/SearchItemModal/types';
import SubmitButton from '@/components/ui/SubmitButton';
import ActionButton from '@/components/ui/ActionButton';
import { updateUser } from '@/services/firebase';
import Toast from 'react-native-toast-message';

export default function AddMealScreen() {
  const { user, updateUserData } = useUserStore();
  const router = useRouter();
  const [currentMealItems, setCurrentMealItems] = useState<ConsumedItem[]>([]);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

  const totalMealMacros = useMemo(() => {
    let totalCalories = 0;
    let totalProteins = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    currentMealItems.forEach((item) => {
      totalCalories += item.macros.calories;
      totalProteins += item.macros.proteins;
      totalCarbs += item.macros.carbs;
      totalFats += item.macros.fats;
    });

    return {
      calories: totalCalories,
      proteins: totalProteins,
      carbs: totalCarbs,
      fats: totalFats,
    };
  }, [currentMealItems]);

  const handleSelectItem = useCallback((item: SearchableItem, quantity: number) => {
    let newItem: ConsumedItem;
    if ('calories' in item) {
      const ingredient = item as Ingredient;
      const caloriesPerGram = ingredient.calories / 100;
      const proteinPerGram = ingredient.proteins / 100;
      const carbPerGram = ingredient.carbs / 100;
      const fatPerGram = ingredient.fats / 100;

      newItem = {
        id: ingredient.id,
        name: ingredient.name,
        itemType: ItemType.INGREDIENT,
        quantity: quantity,
        macros: {
          calories: Math.round(caloriesPerGram * quantity),
          proteins: Math.round(proteinPerGram * quantity),
          carbs: Math.round(carbPerGram * quantity),
          fats: Math.round(fatPerGram * quantity),
        },
      } as MealIngredient;
    } else {
      const recipe = item as Recipe;
      if (!recipe.serves || recipe.serves <= 0) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `La receta "${recipe.name}" no tiene un número de raciones válido.`,
        });
        setIsSearchModalVisible(false);
        return;
      }
      const caloriesPerServing = recipe.macros.calories * quantity;
      const proteinPerServing = recipe.macros.proteins * quantity;
      const carbPerServing = recipe.macros.carbs * quantity;
      const fatPerServing = recipe.macros.fats * quantity;

      newItem = {
        id: recipe.id,
        name: recipe.name,
        itemType: ItemType.RECIPE,
        quantity: quantity,
        macros: {
          calories: Math.round(caloriesPerServing * quantity),
          proteins: Math.round(proteinPerServing * quantity),
          carbs: Math.round(carbPerServing * quantity),
          fats: Math.round(fatPerServing * quantity),
        },
      } as MealRecipe;
    }

    setCurrentMealItems((prevItems) => [...prevItems, newItem]);
    setIsSearchModalVisible(false);
  }, []);

  const handleSaveMeal = useCallback(async () => {
    if (currentMealItems.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No has añadido ningún alimento a la comida.',
      });
      return;
    }

    const today = getDayOfWeek();
    let dailyLog = user?.history?.[today];

    if (user) {
      dailyLog = dailyLogCalculator(dailyLog, currentMealItems, totalMealMacros);

      // Actualizar Firestore
      await updateUser(user.uid, {
        history: {
          ...user.history,
          [today]: dailyLog,
        },
      });
      // Actualizar Zustand
      updateUserData({
        ...user,
        history: {
          ...user.history,
          [today]: dailyLog,
        },
      });
      setCurrentMealItems([]);
      router.replace('/(app)/meals');
    }
  }, [currentMealItems, totalMealMacros, user, router, updateUserData, getDayOfWeek, updateUser]);

  const handleDeleteItem = useCallback((index: number) => {
    setCurrentMealItems((prevItems) => prevItems.filter((_, i) => i !== index));
  }, []);

  const renderMealItem = useCallback(({ item, index }: { item: ConsumedItem; index: number }) => {
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
  }, []);

  const memoizedRenderMealItem = useMemo(() => {
    return renderMealItem;
  }, [renderMealItem]);

  const isWeb = Platform.OS === 'web';

  // Props específicas para KeyboardAvoidingView
  const keyboardAvoidingProps: KeyboardAvoidingViewProps = {
    behavior: Platform.OS === 'ios' ? 'padding' : 'height',
    keyboardVerticalOffset: Platform.OS === 'ios' ? 64 : 0,
    style: { flex: 1 },
  };

  const renderContent = () => (
    <View className="flex-1 p-4">
      <ActionButton
        label="Añadir ingrediente o receta"
        onPress={() => setIsSearchModalVisible(true)}
      />

      <Text className="text-xl font-semibold text-primary my-4">Elementos añadidos: </Text>
      <View className="flex-1">
        {currentMealItems.length === 0 ? (
          <Text className="text-center text-alternate">No has añadido ningún alimento.</Text>
        ) : (
          <FlatList
            data={currentMealItems}
            renderItem={memoizedRenderMealItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
          />
        )}
      </View>

      <SubmitButton onPress={handleSaveMeal} label="Guardar Comida" />
      <SearchItemModal
        isVisible={isSearchModalVisible}
        onClose={() => setIsSearchModalVisible(false)}
        onSelectItem={handleSelectItem}
        itemTypes={['ingredient', 'recipe']}
      />
    </View>
  );

  return (
    <Screen>
      {isWeb ? (
        <View className="flex-1">{renderContent()}</View>
      ) : (
        <KeyboardAvoidingView {...keyboardAvoidingProps}>{renderContent()}</KeyboardAvoidingView>
      )}
    </Screen>
  );
}
