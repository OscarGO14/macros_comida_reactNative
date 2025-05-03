const MyColors = {
  BACKGROUND: '#000000',
  PRIMARY: '#FFFFFF',
  SECONDARY: '#000000',
  ACCENT: '#facc15',
  ALT: '#808080',
  DANGER: '#ef4444',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  ITEM_BACKGROUND: '#1f2937',
} as const;

export type MyColor = (typeof MyColors)[keyof typeof MyColors];
export { MyColors };
