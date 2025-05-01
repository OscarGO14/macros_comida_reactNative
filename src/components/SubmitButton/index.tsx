import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type SubmitButtonProps = {
  onPress: () => void;
  label: string;
};

export default function SubmitButton({ onPress, label }: SubmitButtonProps) {
  return (
    <TouchableOpacity
      className="mt-6 bg-primary-yellow rounded-md p-3 items-center"
      onPress={onPress}
    >
      <Text className="text-primary-black font-bold">{label}</Text>
    </TouchableOpacity>
  );
}
