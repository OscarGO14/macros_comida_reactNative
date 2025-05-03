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

  const baseInputContainerClasses =
    'flex-row items-center bg-item_background rounded-lg p-2 border';

  const conditionalContainerClasses = `
    ${disabled ? 'opacity-50 bg-alternate' : 'bg-item_background'}
    ${hasError ? 'border-danger' : 'border-transparent'}
  `;

  const textInputClasses = `flex-1 text-base ${disabled ? 'text-alternate' : 'text-primary'}`;

  const iconColor = disabled ? 'text-alternate' : hasError ? 'text-danger' : 'text-primary';

  const labelClasses = `mb-1 text-sm ${disabled ? 'text-alternate' : 'text-primary font-medium'}`;

  const errorClasses = 'mt-1 text-sm text-danger';

  return (
    <View style={containerStyle}>
      {label && <Text className={labelClasses}>{label}</Text>}
      <View className={`${baseInputContainerClasses} ${conditionalContainerClasses}`}>
        {iconName && <MaterialCommunityIcons name={iconName} size={20} className={iconColor} />}
        <TextInput
          {...textInputProps}
          style={inputStyle}
          className={textInputClasses}
          placeholderTextColor={MyColors.ALTERNATE}
          editable={isEditable}
          cursorColor={MyColors.ACCENT}
        />
      </View>
      {hasError && <Text className={errorClasses}>{errorMessage}</Text>}
    </View>
  );
};

export default InputText;
