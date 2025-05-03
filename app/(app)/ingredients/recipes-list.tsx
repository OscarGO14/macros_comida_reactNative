import React, { useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useRecipes } from '@/hooks/useRecipes';
import Screen from '@/components/ui/Screen';
import Item from '@/components/ui/Item';
import { ItemType } from '@/components/ui/Item/types';
import ActionButton from '@/components/ui/ActionButton';

export default function RecipesScreen() {
  const router = useRouter();
  // TODO: Crear pantalla de editar receta.
  const { data, loading, error } = useRecipes();

  const handleAddRecipe = useCallback(() => {
    router.push('/(app)/ingredients/add-recipe');
  }, [router]);

  const handleEditRecipe = useCallback(
    (id: string) => {
      //   router.push('/(app)/ingredients/edit-recipe/' + id);
      console.log('handleEditRecipe', id);
    },
    [router],
  );

  return (
    <Screen>
      <View className="flex-1  justify-center gap-4">
        <Text className="text-lg font-semibold text-primary mb-4">Mis recetas</Text>
        {loading && <Text className="text-text-secondary italic">Cargando recetas...</Text>}
        {error && (
          <Text className="text-text-secondary italic">
            Error al cargar recetas: {error.message}
          </Text>
        )}
        {data.length > 0 && (
          <View className="h-4/6">
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <Item
                  name={item.name}
                  type={ItemType.RECIPE}
                  calories={item.macros.calories}
                  onEdit={() => handleEditRecipe(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}
        <ActionButton label="Crear receta" onPress={handleAddRecipe} />
      </View>
    </Screen>
  );
}
