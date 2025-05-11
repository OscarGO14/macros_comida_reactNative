import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { ActionButtonProps } from './types';

export default function ActionButton({
  onPress,
  label,
  disabled = false,
  color = 'primary',
}: ActionButtonProps) {
  const conditionalClasses = disabled ? 'opacity-50' : 'opacity-100';

  const colorConfig = {
    primary: {
      backgroundColor: 'primary',
      textColor: 'secondary',
    },
    secondary: {
      backgroundColor: 'secondary',
      textColor: 'primary',
    },
    accent: {
      backgroundColor: 'accent',
      textColor: 'secondary',
    },
    danger: {
      backgroundColor: 'danger',
      textColor: 'primary',
    },
  };

  return (
    <TouchableOpacity
      className={`bg-${colorConfig[color as keyof typeof colorConfig]?.backgroundColor || 'primary'} rounded-lg p-4 items-center ${conditionalClasses}`}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <Text
        className={`text-base text-${colorConfig[color as keyof typeof colorConfig]?.textColor || 'secondary'} font-bold`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
