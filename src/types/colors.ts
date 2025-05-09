const MyColors = {
  BACKGROUND: '#181920',
  ITEM_BACKGROUND: '#24252B',
  PRIMARY: '#FFFFFF',
  ACCENT: '#ECFE72',
  DANGER: '#99ED8D',
  ALTERNATE: '#808080',
  SECONDARY: '#000000',
} as const;

export type MyColor = (typeof MyColors)[keyof typeof MyColors];
export { MyColors };
