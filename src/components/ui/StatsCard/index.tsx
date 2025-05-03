import React from 'react';
import { View, Text } from 'react-native';
import { MyColors } from '@/types/colors';
import { StatsCardProps } from './types';

export const StatsCard = ({
  title,
  value,
  variant = 'primary',
  size = 'md',
  trend,
  formatValue,
  children,
}: StatsCardProps) => {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  };

  const variantClasses = {
    primary: `bg-[${MyColors.BACKGROUND}] border border-[${MyColors.PRIMARY}]`,
    secondary: `bg-[${MyColors.BACKGROUND}] border border-[${MyColors.ALT}]`,
    accent: `bg-[${MyColors.ACCENT}]`,
  };

  const trendColor = trend?.startsWith('+') ? MyColors.SUCCESS : MyColors.DANGER;

  return (
    <View className={`rounded-xl ${sizeClasses[size]} ${variantClasses[variant]}`}>
      <Text className="text-base text-primary opacity-80 mb-1">{title}</Text>

      <View className="flex-row items-end justify-between">
        <Text className={`text-3xl font-bold text-${variant}`}>
          {formatValue ? formatValue(value) : value}
        </Text>

        {trend && (
          <View className="flex-row items-center">
            <Text style={{ color: trendColor }} className="text-sm">
              {trend}
            </Text>
          </View>
        )}
      </View>

      {children}
    </View>
  );
};

export const StatsCardExample = () => (
  <View className="p-4 gap-4">
    <StatsCard title="Calorías restantes" value={1200} variant="primary" trend="+5%" />

    <StatsCard title="Proteínas" value={85} variant="secondary" formatValue={(v) => `${v}g`} />
  </View>
);
