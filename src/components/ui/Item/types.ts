import { MaterialCommunityIcons } from '@expo/vector-icons';

// Enum para los tipos de item
export const ItemType = {
  INGREDIENT: 'ingredient',
  RECIPE: 'recipe',
  UNKNOWN: 'unknown', // Para casos no esperados o por defecto
} as const;

export interface ItemProps {
  name: string;
  type: (typeof ItemType)[keyof typeof ItemType]; // Cambiamos el tipo a ItemType
  calories: number;
  showType?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

// Nuevo tipo para los nombres de iconos
export type MaterialIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Constantes para los iconos específicos de cada tipo
export const INGREDIENT_ICONS: MaterialIconName[] = [
  'food-apple',
  'food-croissant',
  'food-drumstick',
  'fish',
];

export const RECIPE_ICONS: MaterialIconName[] = [
  'food-takeout-box',
  'food-turkey',
  'food-outline',
  'food-hot-dog',
];
