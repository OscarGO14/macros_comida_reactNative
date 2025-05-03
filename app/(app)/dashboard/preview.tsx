import Item from '@/components/ui/Item';
import { ItemType } from '@/components/ui/Item/types';
import { Text, View } from 'react-native';
import Screen from '@/components/ui/Screen';
import InputText from '@/components/ui/InputText';
import SubmitButton from '@/components/ui/SubmitButton';
import { StatsCard } from '@/components/ui/StatsCard';

// Vamos a probar los nuevos componentes de nuestra librería de ui en src/components/ui

export default function PreviewScreen() {
  return (
    <Screen>
      <Text>Preview</Text>
      <View className="flex-1 gap-4">
        <Item name="Pollo" type={ItemType.INGREDIENT} calories={100} />
        <InputText label="Nombre" placeholder="Nombre" />
        <SubmitButton label="Enviar" onPress={() => {}} />
        <StatsCard
          title="Calorías restantes"
          value={1200}
          variant="primary"
          trend={['g: 5g', 'c: 5g', 'p: 5g']}
        />
      </View>
    </Screen>
  );
}
