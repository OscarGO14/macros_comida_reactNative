import { MyColors } from '@/types/colors';
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart as RNPieChart } from 'react-native-gifted-charts';

const theme = {
  objectiveColor: MyColors.WHITE,
  toEatColor: MyColors.GREY,
  consumedColor: MyColors.YELLOW,
  frameBackground: MyColors.BLACK,
  textPrimary: MyColors.WHITE,
  textSecondary: MyColors.GREY,
};

type PieChartProps = {
  data?: {
    objective: number;
    consumed: number;
  };
};

const DoughnutChart = ({ data }: PieChartProps) => {
  if (!data) {
    return null;
  }

  const pieData = [
    { value: data?.objective ?? 0, color: theme.toEatColor },
    { value: data?.consumed ?? 0, color: theme.consumedColor },
  ];

  const totalTasks = (data?.objective ?? 0) + (data?.consumed ?? 0);

  if (totalTasks === 0) {
    return null;
  }

  const consumedPercentage = ((data?.consumed / data?.objective) * 100).toFixed(0);

  return (
    <View className="bg-background rounded-[20px] overflow-hidden">
      <View className="flex-row">
        {/* Leyenda */}
        <View className="p-5 w-1/2">
          <View className="flex-1 gap-2.5 justify-center">
            <PieLabelRow
              label="Consumidas"
              value={Math.round(data?.consumed).toFixed(0)}
              color={theme.consumedColor}
            />
            <PieLabelRow
              label="Por consumir"
              value={Math.round(data?.objective - data?.consumed).toFixed(0)}
              color={theme.toEatColor}
            />
            <PieLabelRow
              label="Objetivo"
              value={Math.round(data?.objective).toFixed(0)}
              color={theme.objectiveColor}
            />
          </View>
        </View>
        {/* Separador */}
        <View className="bg-grey w-[1px]" />
        {/* Grafico */}
        <View className="items-center flex-row gap-4 justify-center p-[15px] w-1/2">
          <RNPieChart
            data={pieData}
            donut
            sectionAutoFocus
            radius={60}
            innerRadius={40}
            innerCircleColor={theme.frameBackground}
            isAnimated={true}
            centerLabelComponent={() => (
              <View className="items-center justify-center">
                <Text className="text-primary text-[22px] font-bold">{consumedPercentage}%</Text>
                <Text className="text-primary text-[14px]">Consumido</Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const PieLabelRow = ({
  label,
  percentage,
  value,
  color,
}: {
  label: string;
  percentage?: string;
  value?: string;
  color: string;
}) => {
  return (
    <View className="items-center flex-row justify-between">
      <View className="items-center flex-row gap-2">
        <View style={{ backgroundColor: color }} className="rounded-[7px] h-[14px] w-[14px]" />
        <Text className="text-primary text-[16px]">{label}:</Text>
      </View>
      {percentage && (
        <Text className="text-primary text-[16px] font-bold leading-[18px]">{percentage}%</Text>
      )}
      {value && <Text className="text-primary text-[16px] font-bold leading-[18px]">{value}</Text>}
    </View>
  );
};

export default DoughnutChart;
