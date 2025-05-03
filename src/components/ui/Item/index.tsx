import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ItemProps, MaterialIconName, ItemType, INGREDIENT_ICONS, RECIPE_ICONS } from './types';
import { getRandomElement } from '@/utils/getRandomElement';
import { MyColors } from '@/types/colors';

const Item: React.FC<ItemProps> = ({ name, type, calories, onPress, showType = true }) => {
  // Determina el icono basado en el ItemType y memoiza el resultado
  const iconName = useMemo((): MaterialIconName => {
    switch (type) {
      case ItemType.INGREDIENT:
        return getRandomElement(INGREDIENT_ICONS) || 'food-apple';
      case ItemType.RECIPE:
        return getRandomElement(RECIPE_ICONS) || 'food-takeout-box';
      default:
        return 'help-circle';
    }
  }, [type]);

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
    <View className="w-full flex-row items-center justify-between bg-item_background p-4 rounded-lg">
      {/* Icono */}
      <MaterialCommunityIcons
        name={iconName} // Usa el nombre de icono memoizado
        size={24}
        color={MyColors.PRIMARY}
        // Usa los colores de tu tema de Tailwind si los tienes definidos
        // Ejemplo: className="text-primary mr-4"
        className="text-white mr-4" // Color blanco por ahora, ajustar según tu tema
      />

      {/* Contenedor para Nombre y Tipo (ocupa el espacio flexible) */}
      <View className="flex-1 mr-4">
        <Text className="text-white font-bold text-base">{name}</Text>
        {showType && <Text className="text-gray-400 text-sm capitalize">{formattedType()}</Text>}
      </View>

      {/* Calorías */}
      <Text className="text-white font-semibold text-base">{calories} kcal</Text>

      {/* Botón de eliminar */}
      {onPress && (
        <TouchableOpacity className="ml-8" onPress={onPress}>
          <MaterialCommunityIcons name="delete" size={24} color={MyColors.DANGER} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Item;
