const MyColors = {
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  YELLOW: '#facc15',
  GREY: '#808080',
  DANGER: '#ef4444',
} as const;

export type MyColor = (typeof MyColors)[keyof typeof MyColors];
export { MyColors };
