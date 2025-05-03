import { GradientButtonExample } from '@/components/ui/GradientButton';
import Item from '@/components/ui/Item';
import { ItemType } from '@/components/ui/Item/types';
import { StatsCardExample } from '@/components/ui/StatsCard';
import { Text, View } from 'react-native';

// Vamos a probar los nuevos componentes de nuestra librería de ui en src/components/ui

export default function PreviewScreen() {
  return (
    <View className="bg-background flex-1 items-center justify-center">
      <Text>Preview</Text>
      <GradientButtonExample />
      <StatsCardExample />
      <Item name="Pollo" type={ItemType.INGREDIENT} calories={100} />
    </View>
  );
}
