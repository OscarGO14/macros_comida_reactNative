const Collections = {
  ingredients: "ingredients",
} as const;

export type Collections = (typeof Collections)[keyof typeof Collections];

export default Collections;
