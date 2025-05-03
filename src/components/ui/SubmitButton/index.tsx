import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SubmitButtonProps } from './types';

export default function SubmitButton({ onPress, label, disabled = false }: SubmitButtonProps) {
  const conditionalClasses = disabled ? 'opacity-50' : 'opacity-100';

  return (
    <TouchableOpacity
      className={`bg-accent rounded-lg p-4 items-center ${conditionalClasses}`}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <Text className="text-base text-secondary font-bold">{label}</Text>
    </TouchableOpacity>
  );
}
