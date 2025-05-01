import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

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
    <SafeAreaView className="size-full bg-slate-700">
      <View className="flex-1 items-center justify-center px-4">
        <StatusBar style="auto" />
        <Text className="text-white text-xl mb-4">Añadir ingrediente</Text>

        {/* Formulario de añadir ingrediente */}
        <View className="w-full max-w-md gap-3">
          <Text className="text-white">Nombre *</Text>
          <TextInput
            className="border border-white rounded-md p-2 text-white"
            placeholder="Ej: Pollo"
            placeholderTextColor="#ccc"
            value={name}
            onChangeText={setName}
          />

          <Text className="text-white">Categoría (opcional)</Text>
          <TextInput
            className="border border-white rounded-md p-2 text-white"
            placeholder="Ej: Carnes, Lácteos..."
            placeholderTextColor="#ccc"
            value={category}
            onChangeText={setCategory}
          />

          <Text className="text-white">Calorías *</Text>
          <TextInput
            className="border border-white rounded-md p-2 text-white"
            placeholder="Ej: 120"
            placeholderTextColor="#ccc"
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
          />

          <Text className="text-white">Proteínas (g) *</Text>
          <TextInput
            className="border border-white rounded-md p-2 text-white"
            placeholder="Ej: 20"
            placeholderTextColor="#ccc"
            value={proteins}
            onChangeText={setProteins}
            keyboardType="numeric"
          />

          <Text className="text-white">Carbohidratos (g) *</Text>
          <TextInput
            className="border border-white rounded-md p-2 text-white"
            placeholder="Ej: 0"
            placeholderTextColor="#ccc"
            value={carbs}
            onChangeText={setCarbs}
            keyboardType="numeric"
          />

          <Text className="text-white">Grasas (g) *</Text>
          <TextInput
            className="border border-white rounded-md p-2 text-white"
            placeholder="Ej: 2"
            placeholderTextColor="#ccc"
            value={fat}
            onChangeText={setFat}
            keyboardType="numeric"
          />

          <TouchableOpacity
            className="mt-6 bg-emerald-500 rounded-md p-3 items-center"
            onPress={handleSubmit}
          >
            <Text className="text-white font-bold">Añadir ingrediente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
