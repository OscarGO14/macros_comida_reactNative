import React from 'react';
import { View, Text } from 'react-native';
import { StatsCardProps } from './types';

export const StatsCard = ({
  title,
  value,
  variant = 'primary',
  trend,
  formatValue,
  children,
}: StatsCardProps) => {
  const baseContainerClasses = 'bg-item_background p-4 rounded-lg border w-full';

  const borderVariantClasses = {
    primary: 'border-primary',
    secondary: 'border-alternate',
    accent: 'border-accent',
  };

  const textValueVariantClasses = {
    primary: 'text-primary',
    secondary: 'text-alternate',
    accent: 'text-accent',
  };

  const trendTextClass = trend?.startsWith('+') ? 'text-success' : 'text-danger';

  return (
    <View className={`${baseContainerClasses} ${borderVariantClasses[variant]}`}>
      <Text className="text-base text-primary opacity-80 mb-1">{title}</Text>

      <View className="flex-row items-end justify-between">
        <Text className={`text-3xl font-bold ${textValueVariantClasses[variant]}`}>
          {formatValue ? formatValue(value) : value}
        </Text>

        {trend && (
          <View className="flex-row items-center">
            <Text className={`text-sm ${trendTextClass}`}>{trend}</Text>
          </View>
        )}
      </View>

      {children}
    </View>
  );
};
