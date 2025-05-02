import { Ingredient } from '@/types/ingredient';

export interface IngredientsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectIngredient: (ingredient: Ingredient, quantity: number) => void;
}
