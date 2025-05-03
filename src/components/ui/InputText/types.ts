// src/components/ui/InputText/types.ts
import { TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface InputTextProps extends Omit<TextInputProps, 'style' | 'placeholderTextColor'> {
  /** Texto opcional a mostrar encima del input como etiqueta */
  label?: string;
  /** Nombre del icono opcional de MaterialCommunityIcons a mostrar dentro del input, a la izquierda */
  iconName?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  /** Mensaje de error opcional a mostrar debajo del input */
  errorMessage?: string;
  /** Estilos adicionales para el contenedor principal del View */
  containerStyle?: StyleProp<ViewStyle>;
  /** Estilos adicionales para el componente TextInput interno */
  inputStyle?: StyleProp<ViewStyle>; // Podríamos necesitar esto para ajustes finos
  /** Indica si el input está deshabilitado */
  disabled?: boolean;
}
