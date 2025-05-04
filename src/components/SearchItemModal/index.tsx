import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SearchItemModalProps, SearchableItem, TypedSearchableItem } from './types';
import { useIngredients } from '@/hooks/useIngredients';
import { useRecipes } from '@/hooks/useRecipes';
import InputText from '../ui/InputText';
import { ItemType } from '../ui/Item/types';
import Item from '../ui/Item';
import { MyColors } from '@/types/colors';

const SearchItemModal = ({ isVisible, onClose, onSelectItem, itemTypes }: SearchItemModalProps) => {
  const shouldFetchIngredients = itemTypes.includes('ingredient');
  const shouldFetchRecipes = itemTypes.includes('recipe');

  const {
    data: ingredientsData,
    loading: ingredientsLoading,
    error: ingredientsError,
  } = useIngredients();
  const { data: recipesData, loading: recipesLoading, error: recipesError } = useRecipes();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<TypedSearchableItem | null>(null);
  const [quantity, setQuantity] = useState('');

  const loading = ingredientsLoading || recipesLoading;
  const fetchError =
    (shouldFetchIngredients && ingredientsError) || (shouldFetchRecipes && recipesError);

  useEffect(() => {
    if (!isVisible) {
      setSearchTerm('');
      setSelectedItem(null);
      setQuantity('');
    }
  }, [isVisible]);

  const allItems: TypedSearchableItem[] = useMemo(() => {
    const combined: TypedSearchableItem[] = [];
    if (shouldFetchIngredients && ingredientsData) {
      ingredientsData.forEach((ing) => combined.push({ ...ing, itemType: 'ingredient' }));
    }
    if (shouldFetchRecipes && recipesData) {
      recipesData.forEach((rec) => combined.push({ ...rec, itemType: 'recipe' }));
    }
    return combined;
  }, [ingredientsData, recipesData, shouldFetchIngredients, shouldFetchRecipes]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return allItems;
    }
    return allItems.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allItems, searchTerm]);

  const handleSelect = (item: TypedSearchableItem) => {
    setSelectedItem(item);
  };

  const handleConfirm = () => {
    if (!selectedItem) {
      Alert.alert('Error', 'Por favor, selecciona un item.');
      return;
    }
    const numQuantity = parseFloat(quantity);
    // Validar cantidad según tipo (ej: recetas podrían ser enteros?)
    // Cambiado a const porque no se reasigna
    const isValidQuantity = !isNaN(numQuantity) && numQuantity > 0;

    if (!isValidQuantity) {
      const unit = selectedItem.itemType === 'ingredient' ? 'gramos' : 'raciones';
      Alert.alert('Error', `Por favor, introduce una cantidad válida en ${unit}.`);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { itemType: _itemType, ...baseItem } = selectedItem;
    onSelectItem(baseItem as SearchableItem, numQuantity);
    onClose();
  };

  const renderItem = ({ item }: { item: TypedSearchableItem }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      className={`p-2 my-1 rounded ${selectedItem?.id === item.id && selectedItem?.itemType === item.itemType ? 'border border-accent bg-accent/10' : 'border border-transparent'}`}
    >
      <Item
        name={item.name}
        type={item.itemType === 'ingredient' ? ItemType.INGREDIENT : ItemType.RECIPE}
        // Acceder a calorías condicionalmente
        // Si sigue dando error, revisar definición de Recipe['macros']
        calories={item.itemType === 'ingredient' ? item.calories : item.macros.calories}
        showType // Mostrar el tipo (Ingrediente/Receta)
      />
    </TouchableOpacity>
  );

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <SafeAreaView className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="w-11/12 h-5/6 bg-item_background rounded-lg p-5 shadow-lg">
          <Text className="text-xl font-bold text-primary text-center mb-4">Añadir Item</Text>

          <InputText
            placeholder="Buscar ingrediente o receta..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />

          {loading ? (
            <ActivityIndicator size="large" color={MyColors.ACCENT} className="my-4" />
          ) : fetchError ? (
            <Text className="text-destructive text-center my-4">
              Error al cargar datos. {fetchError.message}
            </Text>
          ) : (
            <FlatList
              data={filteredItems}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.itemType}-${item.id}`}
              className="flex-1 my-2"
              ListEmptyComponent={
                <Text className="text-center p-4 text-alternate">No se encontraron items</Text>
              }
            />
          )}

          {selectedItem && (
            <View className="my-2 p-3 border border-border rounded bg-card">
              <Text className="font-semibold mb-2 text-primary">
                Seleccionado: {selectedItem.name}
              </Text>
              <View className="flex-row items-center">
                <TextInput
                  placeholder={
                    selectedItem.itemType === 'ingredient' ? 'Cantidad (gr)' : 'Cantidad (raciones)'
                  }
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  className="border border-input rounded p-2 flex-1 mr-2 bg-background text-primary"
                  placeholderTextColor={MyColors.ALTERNATE}
                />
              </View>
            </View>
          )}

          <View className="flex-row justify-around mt-4">
            <Button title="Cancelar" onPress={onClose} color={MyColors.SECONDARY} />
            <Button
              title="Confirmar"
              onPress={handleConfirm}
              disabled={!selectedItem || loading}
              color={MyColors.ACCENT}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default SearchItemModal;
