// src/components/ui/InputText/index.tsx
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { InputTextProps } from './types';
import { MyColors } from '@/types/colors';

const InputText: React.FC<InputTextProps> = ({
  label,
  iconName,
  errorMessage,
  containerStyle,
  inputStyle,
  disabled = false,
  ...textInputProps
}) => {
  const hasError = !!errorMessage;
  const isEditable = !disabled;

  // Clases base del contenedor del input
  const baseInputContainerClasses =
    'flex-row items-center bg-item_background rounded-lg p-4 border'; // Añadimos border
  // Clases condicionales (error, focus, disabled)
  const conditionalContainerClasses = `
    ${disabled ? 'opacity-50 bg-alternate' : 'bg-item_background'}
    ${hasError ? 'border-danger' : 'border-transparent'}
  `; // TODO: Añadir estilo de foco

  // Clases para el TextInput
  const textInputClasses = `flex-1 ml-2 text-base ${disabled ? 'text-alternate' : 'text-primary'}`;

  // Clases para el icono
  const iconColor = disabled ? 'text-alternate' : hasError ? 'text-danger' : 'text-primary';

  // Clases para el label
  const labelClasses = `mb-1 text-sm ${disabled ? 'text-alternate' : 'text-primary font-medium'}`; // Hacemos el label un poco más pequeño

  // Clases para el mensaje de error
  const errorClasses = 'mt-1 text-sm text-danger';

  return (
    <View style={containerStyle}>
      {label && <Text className={labelClasses}>{label}</Text>}
      <View className={`${baseInputContainerClasses} ${conditionalContainerClasses}`}>
        {iconName && (
          <MaterialCommunityIcons
            name={iconName}
            size={20} // Un poco más pequeño para input
            className={iconColor}
          />
        )}
        <TextInput
          {...textInputProps} // Pasamos todas las props restantes
          style={inputStyle} // Aplicamos estilo directo si se proporciona
          className={textInputClasses}
          placeholderTextColor={MyColors.ALTERNATE} // Colores de placeholder (gris)
          editable={isEditable}
          cursorColor="#007AFF" // Color del cursor (ejemplo azul iOS) - Puedes usar tu color primario
        />
      </View>
      {hasError && <Text className={errorClasses}>{errorMessage}</Text>}
    </View>
  );
};

export default InputText;
