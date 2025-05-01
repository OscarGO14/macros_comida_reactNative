import React from 'react';
import { Text, TextInput, View } from 'react-native';

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  required?: boolean;
};

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  required = false,
}: InputFieldProps) {
  return (
    <View>
      <Text className="text-primary-white">
        {label} {required && '*'}
      </Text>
      <TextInput
        className="border border-primary-white rounded-md p-2 text-primary-white bg-primary-black"
        placeholder={placeholder}
        placeholderTextColor="#ccc"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}
