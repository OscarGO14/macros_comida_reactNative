const Collections = {
  INGREDIENTS: 'ingredients',
} as const;

export type Collections = (typeof Collections)[keyof typeof Collections];

export { Collections };
