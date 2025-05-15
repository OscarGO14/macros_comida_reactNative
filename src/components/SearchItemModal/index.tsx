import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Keyboard,
  Platform,
} from 'react-native';
import { SearchItemModalProps, SearchableItem, TypedSearchableItem } from './types';
import { useIngredients } from '@/hooks/useIngredients';
import { useRecipes } from '@/hooks/useRecipes';
import InputText from '@/components/ui/InputText';
import { ItemType } from '@/components/ui/Item/types';
import Item from '@/components/ui/Item';
import { MyColors } from '@/types/colors';
import ActionButton from '@/components/ui/ActionButton';
import Toast from 'react-native-toast-message';

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
  const inputRef = useRef<TextInput>(null);

  const loading = ingredientsLoading || recipesLoading;
  const fetchError =
    (shouldFetchIngredients && ingredientsError) || (shouldFetchRecipes && recipesError);

  // Manejar la limpieza del modal al cerrarse
  useEffect(() => {
    if (!isVisible) {
      // Descartar el teclado antes de cerrar el modal
      if (Platform.OS === 'web') {
        Keyboard.dismiss();
      }
      // Restablecer los estados
      setSearchTerm('');
      setSelectedItem(null);
      setQuantity('');
    }
  }, [isVisible]);

  const handleCloseModal = () => {
    // Primero descartar el teclado
    Keyboard.dismiss();
    // SCROLL UP IN PAGE
    if (Platform.OS === 'web') {
      window.scrollTo(0, 0);
    }
    // Luego dejar que pase un breve tiempo antes de cerrar el modal
    setTimeout(() => {
      onClose();
    }, 50);
  };

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
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor, selecciona un item.',
      });
      return;
    }
    const numQuantity = parseFloat(quantity);
    // Validar cantidad según tipo (ej: recetas podrían ser enteros?)
    // Cambiado a const porque no se reasigna
    const isValidQuantity = !isNaN(numQuantity) && numQuantity > 0;

    if (!isValidQuantity) {
      const unit = selectedItem.itemType === 'ingredient' ? 'gramos' : 'raciones';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Por favor, introduce una cantidad válida en ${unit}.`,
      });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { itemType: _itemType, ...baseItem } = selectedItem;

    // Descartar el teclado antes de cerrar el modal
    Keyboard.dismiss();

    // Pequeña pausa para asegurarse de que el teclado se haya ocultado completamente
    setTimeout(() => {
      onSelectItem(baseItem as SearchableItem, numQuantity);
      onClose();
    }, 50);
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

  // Manejar toque fuera de la caja del modal para cerrar
  const handleOutsidePress = () => {
    Keyboard.dismiss();
    handleCloseModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleCloseModal}
    >
      <SafeAreaView
        className="flex-1 justify-center items-center bg-black bg-opacity-50"
        onTouchStart={handleOutsidePress}
      >
        <View
          className="w-11/12 h-5/6 bg-item_background rounded-lg p-5 shadow-lg"
          onTouchStart={(e) => e.stopPropagation()} // Evitar que los toques dentro del modal lo cierren
        >
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
                  ref={inputRef}
                  placeholder={
                    selectedItem.itemType === 'ingredient' ? 'Cantidad (gr)' : 'Cantidad (raciones)'
                  }
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  className="border border-input rounded p-2 flex-1 mr-2 bg-background text-primary"
                  placeholderTextColor={MyColors.ALTERNATE}
                  onBlur={() => {
                    if (Platform.OS === 'web') {
                      // Ayuda a prevenir problemas de scroll en web
                      window.scrollTo(0, 0);
                    }
                  }}
                />
              </View>
            </View>
          )}

          <View className="flex-row justify-around mt-4">
            <ActionButton label="Cancelar" onPress={handleCloseModal} color="secondary" />
            <ActionButton
              label="Confirmar"
              onPress={handleConfirm}
              disabled={!selectedItem || loading}
              color="accent"
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default SearchItemModal;
