import Ionicons from '@expo/vector-icons/Ionicons';
import { MyColors } from '@/types/colors';
import { IIcon } from './types';

export default function Icon({ name, size = 32, color = MyColors.YELLOW }: IIcon) {
  return <Ionicons name={name} size={size} color={color} />;
}
