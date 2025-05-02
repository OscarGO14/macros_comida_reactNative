export interface DoughnutDataItem {
  label: string; // Nombre del macro
  value: number; // Valor numérico
  color: string; // Color en formato HEX
}

import { type StyleProp, ViewStyle } from 'react-native';

export interface DoughnutProps {
  data?: Record<string, unknown>[]; // Compatible con PolarChart
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
}
