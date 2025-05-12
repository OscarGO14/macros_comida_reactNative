import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import InputText from '@/components/ui/InputText';
import { db } from '@/services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Collections } from '@/types/collections';
import Screen from '@/components/ui/Screen';
import SubmitButton from '@/components/ui/SubmitButton';
import Toast from 'react-native-toast-message';

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
      const ingredientData = {
        name,
        category: category || 'Sin categoría',
        calories: parseFloat(calories),
        proteins: parseFloat(proteins),
        carbs: parseFloat(carbs),
        fats: parseFloat(fats),
      };
      const docRef = await addDoc(collection(db, Collections.INGREDIENTS), ingredientData);
      Toast.show({
        type: 'success',
        text1: 'Ingrediente',
        text2: 'Ingrediente guardado correctamente con id: ' + docRef.id,
      });
      return Promise.resolve(docRef.id);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error al guardar el ingrediente',
      });
      return Promise.reject(error);
    }
  };

  const handleSubmit = async () => {
    // Validación simple
    if (!name || !calories || !proteins || !carbs || !fats) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor completa todos los campos obligatorios.',
      });
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
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Error al guardar el ingrediente: ${error}`,
      });
    }

    Toast.show({
      type: 'success',
      text1: 'Ingrediente',
      text2: 'Ingrediente añadido correctamente',
    });
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1 items-center justify-center"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View className="w-full gap-2">
          <InputText
            label="Nombre *"
            placeholder="Ej: Pollo"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <InputText
            label="Categoría (Opcional)"
            placeholder="Ej: Carnes, Lácteos, Verduras..."
            value={category}
            onChangeText={setCategory}
          />

          <InputText
            label="Calorías"
            placeholder="Ej: 120"
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
          />

          <InputText
            label="Proteínas"
            placeholder="Ej: 25"
            value={proteins}
            onChangeText={setProteins}
            keyboardType="numeric"
          />
          <InputText
            label="Carbohidratos"
            placeholder="Ej: 5g"
            value={carbs}
            onChangeText={setCarbs}
            keyboardType="numeric"
          />
          <InputText
            label="Grasas (g) *"
            placeholder="Ej: 10"
            value={fats}
            onChangeText={setFats}
            keyboardType="numeric"
          />

          <View className="mt-4">
            <SubmitButton label="Añadir Ingrediente" onPress={handleSubmit} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
