import React from 'react';
import { Pressable, View, Text } from 'react-native';
import type { ButtonProps } from './types';

/**
 * Botón reutilizable para la app con soporte para estilos dinámicos usando NativeWind.
 * Permite pasar clases adicionales y personalizar el texto y el callback.
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  className = '',
  textClassName = '',
  ...props
}) => {
  return (
    <Pressable onPress={onPress} {...props}>
      {({ pressed }) => (
        <View
          className={`${pressed ? 'bg-accent' : 'bg-primary'} px-6 py-3 rounded-full items-center justify-center ${className}`}
        >
          <Text className={`text-base text-secondary font-bold ${textClassName}`}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default Button;
