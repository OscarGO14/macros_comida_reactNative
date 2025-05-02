// src/types/recipe.ts
// Podríamos hacer esto más complejo, referenciando a Ingredient IDs y cantidades
// pero para empezar, un array de strings puede ser suficiente.

import { Macros } from '@/types/macros';

// ¡Actualizado para usar ID!
export type RecipeIngredient = {
  ingredientId: string; // ID del documento del ingrediente en la colección 'ingredients'
  quantity: number;
  // unit: 'g' | 'ml' | 'unidad'; // Eliminar unidad, siempre será 'g'
};

export interface Recipe {
  id: string; // ID del documento en Firestore
  userId: string; // ID del usuario que creó la receta
  name: string;
  ingredients: RecipeIngredient[];
  macros: Macros;
  serves: number; // Número de raciones/comidas que proporciona la receta completa
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Fecha de última actualización
}
