import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DoughnutChart from '@/components/Doughnut';

export default function HomeScreen() {
  return (
    <SafeAreaView className="size-full bg-background">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl text-primary">Resumen de hoy</Text>
        <DoughnutChart
          data={{
            todoTaskCount: 15,
            progressTaskCount: 40,
            completeTaskCount: 45,
          }}
        />
      </View>
    </SafeAreaView>
  );
}
