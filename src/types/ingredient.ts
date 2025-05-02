import { Macros } from '@/types/macros';

// Interfaz para Ingrediente
export interface Ingredient {
  id: string; // Añadido desde el doc.id de Firestore
  name: string;
  category?: string; // Opcional, por si algún dato no lo tiene
  calories: number;
  proteins: number; // Corregido de 'protein' si lo tenías así antes
  carbs: number;
  fat: number;
  macros: Macros; // Macros por 100g o unidad base (ej: 1 huevo)
  // unit?: string; // Eliminar unidad, siempre será 'g'
  userId?: string; // Si es un ingrediente personalizado por un usuario
}
