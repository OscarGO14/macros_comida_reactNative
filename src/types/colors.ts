const MyColors = {
  BACKGROUND: '#000000',
  PRIMARY: '#FFFFFF',
  SECONDARY: '#000000',
  ACCENT: '#facc15',
  ALT: '#808080',
  DANGER: '#ef4444',
} as const;

export type MyColor = (typeof MyColors)[keyof typeof MyColors];
export { MyColors };
