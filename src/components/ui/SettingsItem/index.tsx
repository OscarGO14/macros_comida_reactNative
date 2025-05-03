import React from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// No necesitamos importar 'styled' de nativewind

import { SettingsItemProps, SettingsControlType } from './types';
import { MyColors } from '@/types/colors';

// No necesitamos los componentes 'Styled...'

const SettingsItem: React.FC<SettingsItemProps> = ({
  label,
  controlType,
  value,
  onPress,
  switchProps,
  disabled = false,
  iconName,
}) => {
  // Determina el color del texto basado en si está deshabilitado
  const textColor = disabled ? 'text-alternate' : 'text-primary'; // Ajusta los colores según tu tema

  // Renderiza el control específico (Switch, Texto+Flecha, Flecha)
  const renderControl = () => {
    switch (controlType) {
      case SettingsControlType.SWITCH:
        const switchValue = typeof value === 'boolean' ? value : false;
        return (
          <Switch
            // Aplicamos className directamente si es necesario o usamos props estándar
            trackColor={{ false: '#767577', true: '#81b0ff' }} // Colores estándar
            thumbColor={switchValue ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onPress}
            value={switchValue}
            disabled={disabled}
            {...switchProps}
            // className="..." si necesitas estilos adicionales específicos para el Switch
          />
        );
      case SettingsControlType.TEXT_ARROW:
        return (
          <View className="flex-row items-center">
            <Text className={`${textColor} mr-2`}>{typeof value === 'string' ? value : ''}</Text>
            {/* Para iconos, className se usa a menudo para el color o margen */}
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={disabled ? '#767577' : 'gray'}
            />
          </View>
        );
      case SettingsControlType.ARROW_ONLY:
        return (
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={disabled ? '#767577' : 'gray'}
          />
        );
      case SettingsControlType.NONE:
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      className={`flex-row w-full items-center bg-item_background p-4 rounded-lg ${disabled ? 'opacity-50' : ''}`} // Aplicamos className directamente
      onPress={controlType !== SettingsControlType.SWITCH ? onPress : undefined}
      disabled={disabled || controlType === SettingsControlType.SWITCH}
      activeOpacity={0.7}
    >
      {iconName && (
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={MyColors.PRIMARY}
          className={`${textColor} mr-4`}
        />
      )}
      <Text className={`flex-1 ${textColor} text-base`}>{label}</Text>
      <View>{renderControl()}</View>
    </TouchableOpacity>
  );
};

export default SettingsItem;
