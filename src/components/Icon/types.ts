import type Ionicons from '@expo/vector-icons/Ionicons';

export type IconName = keyof typeof Ionicons.glyphMap;

export interface IIcon {
  name: IconName; // Tipo de dato que se espera recibir, en este caso, un nombre de icon;
  size?: number;
  color?: string;
}
