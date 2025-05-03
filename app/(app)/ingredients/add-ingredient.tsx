import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Button from '@/components/ui/Button';
import InputText from '@/components/ui/InputText';
import { db } from '@/services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Collections } from '@/types/collections';
import Screen from '@/components/ui/Screen';
import SubmitButton from '@/components/ui/SubmitButton';

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
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 w-full items-center justify-center"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View className="w-full max-w-sm gap-2">
          <InputText
            label="Nombre *"
            placeholder="Ej: Pollo"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            containerStyle={{ marginBottom: 16 }}
          />

          <InputText
            label="Categoría (Opcional)"
            placeholder="Ej: Carnes, Lácteos, Verduras..."
            value={category}
            onChangeText={setCategory}
            containerStyle={{ marginBottom: 16 }}
          />

          <InputText
            label="Calorías"
            placeholder="Ej: 120"
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
            containerStyle={{ marginBottom: 16 }}
          />

          <InputText
            label="Proteínas"
            placeholder="Ej: 25"
            value={proteins}
            onChangeText={setProteins}
            keyboardType="numeric"
            containerStyle={{ flex: 1, marginRight: 8 }}
          />
          <InputText
            label="Carbohidratos"
            placeholder="Ej: 5g"
            value={carbs}
            onChangeText={setCarbs}
            keyboardType="numeric"
            containerStyle={{ flex: 1, marginHorizontal: 4 }}
          />
          <InputText
            label="Grasas"
            placeholder="Ej: 10g"
            value={fats}
            onChangeText={setFats}
            keyboardType="numeric"
            containerStyle={{ flex: 1, marginLeft: 8 }}
          />

          <View className="mt-4">
            <SubmitButton label="Añadir Ingrediente" onPress={handleSubmit} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
