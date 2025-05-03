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

  return (
    <TouchableOpacity
      className={`bg-${color} rounded-lg p-4 items-center ${conditionalClasses}`}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <Text className="text-base text-secondary font-bold">{label}</Text>
    </TouchableOpacity>
  );
}
