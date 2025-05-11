import React from 'react';
import { View, Text } from 'react-native';
import { StatsCardProps } from './types';

export const StatsCard = ({
  title,
  value,
  variant = 'primary',
  trend = [],
  formatValue,
  children,
}: StatsCardProps) => {
  const borderVariantClasses = {
    primary: 'border-primary',
    secondary: 'border-alternate',
    accent: 'border-primary',
  };

  const textValueVariantClasses = {
    primary: 'text-primary',
    secondary: 'text-alternate',
    accent: 'text-secondary',
  };

  const backgroundVariantClasses = {
    primary: 'bg-background_item',
    secondary: 'bg-alternate',
    accent: 'bg-accent',
  };

  const trendVariantClasses = {
    primary: 'text-accent',
    secondary: 'text-primary',
    accent: 'text-secondary',
  };

  const baseContainerClasses = `${backgroundVariantClasses[variant]} p-4 rounded-lg border w-full`;

  return (
    <View className={`${baseContainerClasses} ${borderVariantClasses[variant]}`}>
      <Text className={`text-base ${textValueVariantClasses[variant]} opacity-80 mb-1`}>
        {title}
      </Text>

      <View className="flex-row items-end justify-between">
        <Text className={`text-3xl font-bold ${textValueVariantClasses[variant]}`}>
          {formatValue ? formatValue(value) : value} kcal
        </Text>

        {trend && (
          <View className="flex-row items-center gap-4">
            {trend.map((item, index) => (
              <Text key={index} className={`text-sm ${trendVariantClasses[variant]}`}>
                {item}
              </Text>
            ))}
          </View>
        )}
      </View>

      {children}
    </View>
  );
};
