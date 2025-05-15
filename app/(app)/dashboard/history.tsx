import React, { useMemo } from 'react';
import Screen from '@/components/ui/Screen';
import { useUserStore } from '@/store/userStore';
import { History } from '@/types/history';
import { View, Text } from 'react-native';

const DashboardHistory = () => {
  const { user } = useUserStore();
  const history: History = user?.history ?? {};

  const historyData = useMemo(() => {
    return Object.entries(history).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  }, [history]);

  return (
    <Screen>
      <View className="flex-1 items-center justify-center">
        <View className="w-full p-4">
          {historyData.map((item) => (
            <View key={item.id} className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold">{item.id}</Text>
              <Text className="text-alternate">
                {item.meals.map((meal, index) => (
                  <Text key={index} className="block">
                    {meal.items.map((food) => (
                      <Text key={food.id} className="text-alternate">
                        {food.name}
                      </Text>
                    ))}
                  </Text>
                ))}
              </Text>
              <Text className="text-alternate">
                Total Macros: {JSON.stringify(item.totalMacros)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
};

export default DashboardHistory;
