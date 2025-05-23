import React, { useState, useMemo } from 'react';
import { Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useIngredients } from '@/hooks/useIngredients';
import Screen from '@/components/ui/Screen';
import Item from '@/components/ui/Item';
import { ItemType } from '@/components/ui/Item/types';
import { Ingredient } from '@/types/ingredient';
import { MyColors } from '@/types/colors';
import InputText from '@/components/ui/InputText';

export default function IngredientsListScreen() {
  const { data: ingredientsData, loading, error } = useIngredients();
  const [search, setSearch] = useState('');

  const filteredIngredients = useMemo(
    () =>
      ingredientsData?.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [ingredientsData, search],
  );

  const handlePressIngredient = (id: string) => {
    console.log('Ingredient ID:', id);
  };

  const renderIngredientItem = ({ item }: { item: Ingredient }) => (
    <TouchableOpacity
      className="w-full"
      onPress={() => handlePressIngredient(item.id)}
      activeOpacity={0.7}
    >
      <Item name={item.name} calories={item.calories} type={ItemType.INGREDIENT} />
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View className="flex-1 items-center justify-center mt-10">
      <Text className="text-primary text-lg">No se encontraron ingredientes.</Text>
    </View>
  );

  const renderItemSeparator = () => <View className="h-2" />;

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={MyColors.ACCENT} />
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-red-500 text-lg text-center mb-4">
            Error al cargar ingredientes:
          </Text>
          <Text className="text-red-400 text-center">{error.message}</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text className="text-primary text-2xl font-bold py-4">Lista de Ingredientes</Text>
      <InputText
        placeholder="Buscar ingrediente..."
        value={search}
        onChangeText={setSearch}
        className="mb-4"
      />
      <View className="flex-1 py-4">
        <FlatList
          data={filteredIngredients}
          renderItem={renderIngredientItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyList}
          ItemSeparatorComponent={renderItemSeparator}
        />
      </View>
    </Screen>
  );
}
