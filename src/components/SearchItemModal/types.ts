import { Ingredient } from '@/types/ingredient';
import { Recipe } from '@/types/recipe';

// Unión base (puede no ser necesaria si TypedSearchableItem es suficiente)
export type SearchableItem = Ingredient | Recipe;

export type SearchableItemType = 'ingredient' | 'recipe';

// Tipos específicos para la unión discriminada
export type TypedIngredient = Ingredient & {
  itemType: 'ingredient';
};
export type TypedRecipe = Recipe & {
  itemType: 'recipe';
};

// La unión discriminada correcta
export type TypedSearchableItem = TypedIngredient | TypedRecipe;

export interface SearchItemModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectItem: (item: SearchableItem, quantity: number) => void;
  itemTypes: SearchableItemType[];
}
