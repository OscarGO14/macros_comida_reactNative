import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ItemProps, MaterialIconName, ItemType, INGREDIENT_ICONS, RECIPE_ICONS } from './types';
import { getRandomElement } from '@/utils/getRandomElement';

const Item: React.FC<ItemProps> = ({ name, type, calories }) => {
  // Determina el icono basado en el ItemType
  const getIconName = (): MaterialIconName => {
    switch (type) {
      case ItemType.INGREDIENT:
        // Usamos el helper y la constante importada
        return getRandomElement(INGREDIENT_ICONS) || 'food-apple'; // 'food-apple' como fallback
      case ItemType.RECIPE:
        // Usamos el helper y la constante importada
        return getRandomElement(RECIPE_ICONS) || 'food-takeout-box'; // 'food-takeout-box' como fallback
      default:
        return 'help-circle'; // Icono por defecto para UNKNOWN u otros casos
    }
  };

  const iconName = getIconName();

  // Formatea el tipo para mostrarlo en la UI
  const formattedType = () => {
    switch (type) {
      case ItemType.INGREDIENT:
        return 'Ingrediente';
      case ItemType.RECIPE:
        return 'Receta';
      default:
        return 'Desconocido'; // Texto por defecto
    }
  };

  return (
    // Contenedor principal: fondo oscuro, padding, borde redondeado, layout en fila, centrado vertical
    <View className="flex-row items-center bg-item_background p-4 rounded-lg">
      {/* Icono */}
      <MaterialCommunityIcons
        name={iconName}
        size={24}
        // Usa los colores de tu tema de Tailwind si los tienes definidos
        // Ejemplo: className="text-primary mr-4"
        className="text-white mr-4" // Color blanco por ahora, ajustar según tu tema
      />

      {/* Contenedor para Nombre y Tipo (ocupa el espacio flexible) */}
      <View className="flex-1 mr-4">
        <Text className="text-white font-bold text-base">{name}</Text>
        <Text className="text-gray-400 text-sm capitalize">{formattedType()}</Text>
      </View>

      {/* Calorías */}
      <Text className="text-white font-semibold text-base">{calories} kcal</Text>
    </View>
  );
};

export default Item;
