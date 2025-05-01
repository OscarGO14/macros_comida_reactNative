import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SubmitButtonProps } from './types';

export default function SubmitButton({ onPress, label }: SubmitButtonProps) {
  return (
    <TouchableOpacity className="mt-6 bg-accent rounded-md p-3 items-center" onPress={onPress}>
      <Text className="text-base text-secondary font-bold">{label}</Text>
    </TouchableOpacity>
  );
}
