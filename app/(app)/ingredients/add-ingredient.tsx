import React, { useState } from 'react';
import { View, Text, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Button from '@/components/ui/SubmitButton/Button';
import { addDoc, db } from '@/services/firebase';
import { collection } from 'firebase/firestore';
import { Collections } from '@/types/collections';

export default function AddIngredientScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [calories, setCalories] = useState('');
  const [proteins, setProteins] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  // Función para guardar el ingrediente
  const saveIngredient = async () => {
    try {
      const docRef = await addDoc(collection(db, Collections.INGREDIENTS), {
        name,
        category,
        calories,
        proteins,
        carbs,
        fats,
      });
      Alert.alert('Ingrediente', 'Ingrediente guardado correctamente con id: ' + docRef.id);
      return Promise.resolve(docRef.id);
    } catch (error) {
      console.error('Error al guardar el ingrediente:', error);
      Alert.alert('Error', 'Error al guardar el ingrediente');
      return Promise.reject(error);
    }
  };

  const handleSubmit = async () => {
    // Validación simple
    if (!name || !calories || !proteins || !carbs || !fats) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    try {
      await saveIngredient();
      setName('');
      setCategory('');
      setCalories('');
      setProteins('');
      setCarbs('');
      setFats('');
    } catch (error) {
      console.error('Error al guardar el ingrediente:', error);
      Alert.alert('Error', 'Error al guardar el ingrediente');
    }

    Alert.alert('Ingrediente', 'Ingrediente añadido correctamente (simulado)');
  };

  return (
    // Contenedor principal con padding y fondo
    <SafeAreaView className="flex-1 items-center bg-background p-4">
      <StatusBar style="light" />
      {/* Título con estilo */}
      <Text className="mb-6 text-2xl font-bold text-primary">Añadir Ingrediente</Text>

      {/* Contenedor del formulario con ancho máximo */}
      <View className="w-full max-w-sm">
        {/* Campo Nombre */}
        <Text className="mb-2 text-sm font-medium text-gray-400">Nombre *</Text>
        <TextInput
          className="mb-4 h-12 w-full rounded-md border border-alternate bg-input px-4 text-primary"
          placeholder="Ej: Pollo"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        {/* Campo Categoría */}
        <Text className="mb-2 text-sm font-medium text-gray-400">Categoría (Opcional)</Text>
        <TextInput
          className="mb-4 h-12 w-full rounded-md border border-alternate bg-input px-4 text-primary"
          placeholder="Ej: Carnes, Lácteos, Verduras..."
          placeholderTextColor="#9CA3AF"
          value={category}
          onChangeText={setCategory}
        />

        {/* Campo Calorías */}
        <Text className="mb-2 text-sm font-medium text-gray-400">Calorías (kcal) *</Text>
        <TextInput
          className="mb-4 h-12 w-full rounded-md border border-alternate bg-input px-4 text-primary"
          placeholder="Ej: 120"
          placeholderTextColor="#9CA3AF"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
        />

        {/* Campo Proteínas */}
        <Text className="mb-2 text-sm font-medium text-gray-400">Proteínas (g) *</Text>
        <TextInput
          className="mb-4 h-12 w-full rounded-md border border-alternate bg-input px-4 text-primary"
          placeholder="Ej: 20"
          placeholderTextColor="#9CA3AF"
          value={proteins}
          onChangeText={setProteins}
          keyboardType="numeric"
        />

        {/* Campo Carbohidratos */}
        <Text className="mb-2 text-sm font-medium text-gray-400">Carbohidratos (g) *</Text>
        <TextInput
          className="mb-4 h-12 w-full rounded-md border border-alternate bg-input px-4 text-primary"
          placeholder="Ej: 0"
          placeholderTextColor="#9CA3AF"
          value={carbs}
          onChangeText={setCarbs}
          keyboardType="numeric"
        />

        {/* Campo Grasas */}
        <Text className="mb-2 text-sm font-medium text-gray-400">Grasas (g) *</Text>
        <TextInput
          className="mb-6 h-12 w-full rounded-md border border-alternate bg-input px-4 text-primary"
          placeholder="Ej: 2"
          placeholderTextColor="#9CA3AF"
          value={fats}
          onChangeText={setFats}
          keyboardType="numeric"
        />

        {/* Botón Añadir */}
        <Button title="Añadir Ingrediente" onPress={handleSubmit} className="bg-accent" />
      </View>
    </SafeAreaView>
  );
}
