import React from 'react';
import { View, Text } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const toastConfig = {
  error: ({ text1, text2 }: CustomToastProps) => (
    <View className="flex-row items-center justify-start w-[90%] h-[52px] border border-danger bg-danger p-3 rounded-lg">
      {text1 && <Text className="text-base text-danger">{text1}</Text>}
      {text2 && <Text className="text-base text-primary">{text2}</Text>}
    </View>
  ),
  success: ({ text1, text2 }: CustomToastProps) => (
    <View className="flex-row items-center justify-start w-[90%] h-[52px] border border-accent bg-accent p-3 rounded-lg">
      {text1 && <Text className="text-accent text-base font-semibold">{text1}</Text>}
      {text2 && <Text className="text-primary text-base">{text2}</Text>}
    </View>
  ),
  delete: ({ text1, text2 }: CustomToastProps) => (
    <View className="flex-row items-center justify-start w-[90%] h-[52px] border border-danger bg-primary p-3 rounded-lg">
      {text1 && <Text className="text-danger text-base font-semibold">{text1}</Text>}
      {text2 && <Text className="text-primary text-base">{text2}</Text>}
    </View>
  ),
};

export default toastConfig;
