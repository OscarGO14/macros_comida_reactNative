import { PressableProps } from 'react-native';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  /** Texto del botón */
  title: string;
  /** Estilos extra para el botón */
  className?: string;
  /** Estilos extra para el texto */
  textClassName?: string;
}
