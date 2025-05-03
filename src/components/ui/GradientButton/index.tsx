import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { GradientButtonProps } from './types';
import { MyColors } from '@/types/colors';

export function GradientButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  gradient = true,
  disabled = false,
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  const variantClasses = {
    primary: 'border border-primary',
    secondary: 'border border-alt',
    accent: 'border border-accent',
  };

  const baseColor =
    variant === 'primary'
      ? MyColors.PRIMARY
      : variant === 'secondary'
        ? MyColors.SECONDARY
        : MyColors.ACCENT;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`rounded-lg ${sizeClasses[size]} ${variantClasses[variant]} ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <View className="rounded-lg overflow-hidden relative">
        {gradient && (
          <>
            <View className="absolute inset-0 opacity-80" style={{ backgroundColor: baseColor }} />
            <View
              className="absolute inset-0 left-1/3 w-1/3 opacity-50"
              style={{ backgroundColor: baseColor }}
            />
            <View
              className="absolute inset-0 left-2/3 w-1/3 opacity-20"
              style={{ backgroundColor: baseColor }}
            />
          </>
        )}
        <Text className={`text-center text-base text-${variant} font-semibold relative z-10`}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// El componente GradientButtonExample permanece igual
export const GradientButtonExample = () => (
  <View className="p-4">
    <GradientButton
      title="Ejemplo Primario"
      variant="primary"
      onPress={() => console.log('click')}
    />
    <GradientButton
      title="Ejemplo Secundario"
      variant="secondary"
      onPress={() => console.log('click')}
      className="mt-4"
    />
    <GradientButton
      title="Ejemplo Acento"
      variant="accent"
      onPress={() => console.log('click')}
      className="mt-4"
    />
  </View>
);
