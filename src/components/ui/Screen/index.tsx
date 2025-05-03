import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView className="flex-1 bg-background pt-4">
      <View className="flex-1 px-6">{children}</View>
    </SafeAreaView>
  );
}
