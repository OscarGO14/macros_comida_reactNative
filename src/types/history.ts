// src/types/history.ts
import { Timestamp } from 'firebase/firestore';
import { Macros } from './macros'; // Reutilizamos el tipo Macros

// Define la estructura de un alimento o receta consumida en una comida
type ConsumedItem = {
  itemId: string; // ID del ingrediente o receta
  name: string; // Nombre para mostrar
  quantity: number;
  unit: 'g';
  macros: Macros; // Macros calculados para la cantidad consumida
};

// Define la estructura de una comida (desayuno, almuerzo, etc.)
type Meal = {
  name: string; // 'Desayuno', 'Almuerzo', 'Cena', 'Snacks'
  items: ConsumedItem[];
  totalMacros: Macros; // Macros totales de esta comida
};

export interface DailyLog {
  // El ID será la fecha YYYY-MM-DD, pero no es necesario ponerlo explícitamente en el tipo
  date: Timestamp; // Fecha del registro (usaremos Timestamp de Firestore)
  meals: Meal[];
  totalMacros: Macros; // Macros totales del día
  // Podrías añadir otros campos como notas del día, nivel de actividad, etc.
}
