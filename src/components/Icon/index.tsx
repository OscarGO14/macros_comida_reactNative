import Ionicons from '@expo/vector-icons/Ionicons';
import { MyColors } from '@/types/colors';
import { IIcon } from './types';

export default function Icon({ name, size = 32, color = MyColors.ACCENT }: IIcon) {
  return <Ionicons name={name} size={size} color={color} />;
}
