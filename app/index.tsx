import Doughnut from '@/components/Doughnut';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// En esta pestaña quiero hacer un Resumen de las macros del día.

// 1. Un gráfico circular que muestre el porcentaje de macros consumidas.
// 2.

export default function HomeScreen() {
  return (
    <SafeAreaView className="size-full bg-background">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl text-primary">Resumen de hoy</Text>
        {/* Aquí vamos a meter el gráfico */}
        <Doughnut />
      </View>
    </SafeAreaView>
  );
}
