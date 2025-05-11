import { Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const Advice = ({ information }: { information: string }) => {
  return (
    <View className="flex-row bg-accent w-full rounded-lg justify-center items-center min-h-24">
      <View className="flex-start pl-1 py-1 h-full">
        <MaterialCommunityIcons name="information" size={18} color="black" />
      </View>
      <Text className="flex-1text-secondary text-base text-left p-4">{information}</Text>
    </View>
  );
};
