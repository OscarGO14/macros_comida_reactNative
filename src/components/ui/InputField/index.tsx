import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { InputFieldProps } from './types';

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  required = false,
}: InputFieldProps) {
  return (
    <View className="bg-background">
      <Text className="text-base text-primary">
        {label} {required && '*'}
      </Text>
      <TextInput
        className="border text-base border-primary rounded-md p-2 text-primary"
        placeholder={placeholder}
        placeholderTextColor="#ccc"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}
