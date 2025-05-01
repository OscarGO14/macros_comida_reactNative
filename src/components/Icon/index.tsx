import Ionicons from '@expo/vector-icons/Ionicons';

type IconName = keyof typeof Ionicons.glyphMap;

interface IIcon {
  name: IconName; // Tipo de dato que se espera recibir, en este caso, un nombre de icon;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 32, color = 'black' }: IIcon) {
  return <Ionicons name={name} size={size} color={color} />;
}
