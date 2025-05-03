import React from 'react';
import { SwitchProps } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Asegúrate de importar esto

// Tipo de control que se mostrará a la derecha (usando as const)
export const SettingsControlType = {
  SWITCH: 'switch',
  TEXT_ARROW: 'text_arrow', // Texto + Flecha
  ARROW_ONLY: 'arrow_only', // Solo Flecha
  NONE: 'none', // Sin control (solo texto)
} as const; // Importante: as const

// Derivar el tipo de unión de los valores del objeto
type SettingsControlValue = (typeof SettingsControlType)[keyof typeof SettingsControlType];

export interface SettingsItemProps {
  /** Texto principal del elemento */
  label: string;
  /** Tipo de control a mostrar a la derecha */
  controlType: SettingsControlValue; // Usamos el tipo derivado
  /** Valor actual (relevante para SWITCH y TEXT_ARROW) */
  value?: boolean | string;
  /** Función a llamar cuando el valor cambia (para SWITCH) o se presiona el item */
  onPress?: () => void;
  /** Props adicionales para el componente Switch, si se usa */
  switchProps?: Omit<SwitchProps, 'value' | 'onValueChange'>; // Excluimos las que manejamos directamente
  /** Indica si el item está deshabilitado */
  disabled?: boolean;
  /** Opcional: Icono a mostrar a la izquierda del label (nombre del icono de MaterialCommunityIcons) */
  iconName?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}
