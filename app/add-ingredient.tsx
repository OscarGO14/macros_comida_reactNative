import { StatusBar } from 'expo-status-bar';
import { Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import InputField from '@/components/InputField';
import SubmitButton from '@/components/SubmitButton';

// Vista de añadir ingrediente
export default function AddIngredientScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [calories, setCalories] = useState('');
  const [proteins, setProteins] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const handleSubmit = () => {
    // Validación simple
    if (!name || !calories || !proteins || !carbs || !fat) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }
    // Aquí podrías llamar a tu lógica para guardar el ingrediente
    Alert.alert('Ingrediente', 'Ingrediente añadido correctamente (simulado)');
  };

  return (
    <SafeAreaView className="size-full bg-primary-black">
      <View className="flex-1 items-center justify-center px-4 bg-primary-black">
        <StatusBar style="auto" />
        <Text className="text-primary-yellow text-xl mb-4 font-bold">Añadir ingrediente</Text>

        {/* Formulario de añadir ingrediente */}
        <View className="w-full max-w-md gap-3">
          <InputField
            label="Nombre"
            value={name}
            onChangeText={setName}
            placeholder="Ej: Pollo"
            required
          />

          <InputField
            label="Categoría (opcional)"
            value={category}
            onChangeText={setCategory}
            placeholder="Ej: Carnes, Lácteos..."
          />

          <InputField
            label="Calorías"
            value={calories}
            onChangeText={setCalories}
            placeholder="Ej: 120"
            keyboardType="numeric"
            required
          />

          <InputField
            label="Proteínas (g)"
            value={proteins}
            onChangeText={setProteins}
            placeholder="Ej: 20"
            keyboardType="numeric"
            required
          />

          <InputField
            label="Carbohidratos (g)"
            value={carbs}
            onChangeText={setCarbs}
            placeholder="Ej: 0"
            keyboardType="numeric"
            required
          />

          <InputField
            label="Grasas (g)"
            value={fat}
            onChangeText={setFat}
            placeholder="Ej: 2"
            keyboardType="numeric"
            required
          />

          <SubmitButton onPress={handleSubmit} label="Añadir ingrediente" />
        </View>
      </View>
    </SafeAreaView>
  );
}
