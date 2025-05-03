// src/components/IngredientsModal/IngredientsModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  Button, // Usaremos nuestro Button custom luego
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ingredient } from '@/types/ingredient';
import { IngredientsModalProps } from './types';
import { useIngredients } from '@/hooks/useIngredients'; // Importar el hook
import InputText from '../ui/InputText';
import { ItemType } from '../ui/Item/types';
import Item from '../ui/Item';
import { MyColors } from '@/types/colors';
// Importar Button custom si existe
// import Button from '@/components/Button';

const IngredientsModal = ({ isVisible, onClose, onSelectIngredient }: IngredientsModalProps) => {
  // Usar el hook useIngredients
  const { data: ingredients, loading, error: fetchError } = useIngredients();

  // Estados locales que se mantienen
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [quantity, setQuantity] = useState('');

  // Resetear estado local al cerrar (se mantiene, pero sin el fetch)
  useEffect(() => {
    if (!isVisible) {
      setSearchTerm('');
      setSelectedIngredient(null);
      setQuantity('');
      // No necesitamos resetear error/loading del hook aquí
    }
  }, [isVisible]);

  // Filtrar ingredientes basado en searchTerm (usa 'ingredients' del hook)
  const filteredIngredients = useMemo(() => {
    if (!searchTerm) {
      return ingredients;
    }
    return ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [ingredients, searchTerm]);

  const handleSelect = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
  };

  const handleConfirm = () => {
    if (!selectedIngredient) {
      Alert.alert('Error', 'Por favor, selecciona un ingrediente.');
      return;
    }
    const numQuantity = parseFloat(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      Alert.alert('Error', 'Por favor, introduce una cantidad válida mayor que 0.');
      return;
    }

    onSelectIngredient(selectedIngredient, numQuantity);
    onClose(); // Cierra el modal después de seleccionar
  };

  const renderIngredientItem = ({ item }: { item: Ingredient }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      className={`${selectedIngredient?.id === item.id ? 'border border-accent' : ''}`}
    >
      <Item name={item.name} type={ItemType.INGREDIENT} calories={20} />
    </TouchableOpacity>
  );

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <SafeAreaView className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="w-11/12 h-5/6 bg-item_background rounded-lg p-5 shadow-lg">
          <Text className="text-xl font-bold text-primary text-center">Añadir Ingrediente</Text>

          {/* --- Buscador --- */}
          <InputText
            placeholder="Buscar ingrediente..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />

          {/* --- Lista de Ingredientes --- */}
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : fetchError ? ( // Usar el error del hook
            <Text className="text-red-500 text-center">Error al cargar ingredientes.</Text> // Mensaje genérico o usar fetchError.message
          ) : (
            <FlatList
              data={filteredIngredients}
              renderItem={renderIngredientItem}
              keyExtractor={(item) => item.id}
              className="flex-1 mb-4"
              ListEmptyComponent={
                <Text className="text-center p-4 text-gray-500">
                  No se encontraron ingredientes
                </Text>
              }
            />
          )}

          {/* --- Selección y Cantidad --- */}
          {selectedIngredient && (
            <View className="mb-4 p-3 border border-alternate rounded bg-blue-50">
              <Text className="font-semibold mb-2">Seleccionado: {selectedIngredient.name}</Text>
              <View className="flex-row items-center">
                <TextInput
                  placeholder="Cantidad en gramos"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  className="border border-alternate rounded p-2 flex-1 mr-2"
                />
              </View>
            </View>
          )}

          {/* --- Botones --- */}
          <View className="flex-row justify-around">
            {/* Usar Button custom cuando esté listo */}
            <Button title="Cancelar" onPress={onClose} color={MyColors.ALTERNATE} />
            <Button
              title="Confirmar"
              onPress={handleConfirm}
              disabled={!selectedIngredient || loading}
              color={MyColors.ACCENT}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default IngredientsModal;
