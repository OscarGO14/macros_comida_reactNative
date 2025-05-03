import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Button from '@/components/ui/Button';
import { useRecipes } from '@/hooks/useRecipes';

// TODO: Implementar la carga y visualización de recetas del usuario

export default function RecipesScreen() {
  const router = useRouter();

  const { data, loading, error } = useRecipes();

  const handleAddRecipe = () => {
    // Navegar a la pantalla de añadir receta (que crearemos)
    router.push('/(app)/recipes/add');
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
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
    </SafeAreaView>
  );
}
