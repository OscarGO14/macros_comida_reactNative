import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/ui/Button';
import { useRecipes } from '@/hooks/useRecipes';
import Screen from '@/components/ui/Screen';

export default function RecipesScreen() {
  const router = useRouter();

  const { data, loading, error } = useRecipes();

  const handleAddRecipe = () => {
    // Navegar a la pantalla de añadir receta (que crearemos)
    router.push('/(app)/recipes/add-recipe');
  };

  return (
    <Screen>
      <View className="flex-1 items-center gap-4">
        <Text className="text-lg font-semibold text-primary mb-4">Mis Recetas</Text>
        {loading && <Text className="text-text-secondary italic">Cargando recetas...</Text>}
        {error && (
          <Text className="text-text-secondary italic">
            Error al cargar recetas: {error.message}
          </Text>
        )}
        {data.length > 0 &&
          data.map((item) => (
            <Text key={item.id} className="text-primary italic">
              {item.name}
            </Text>
          ))}

        <Button title="Añadir Receta" onPress={handleAddRecipe} />
      </View>
    </Screen>
  );
}
