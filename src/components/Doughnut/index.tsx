import { MyColors } from '@/types/colors';
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart as RNPieChart } from 'react-native-gifted-charts';

const theme = {
  toDoColor: MyColors.WHITE,
  progressColor: MyColors.GREY,
  completedColor: MyColors.YELLOW,
  frameBackground: MyColors.BLACK,
  textPrimary: MyColors.WHITE,
  textSecondary: MyColors.GREY,
};

type PieChartProps = {
  data?: {
    todoTaskCount: number;
    progressTaskCount: number;
    completeTaskCount: number;
  };
};

const DoughnutChart = ({ data }: PieChartProps) => {
  const { width } = Dimensions.get('window');
  const isLargeScreen = width > 1024;

  if (!data) {
    return null;
  }

  const pieData = [
    { value: data?.todoTaskCount ?? 0, color: theme.toDoColor },
    { value: data?.progressTaskCount ?? 0, color: theme.progressColor },
    { value: data?.completeTaskCount ?? 0, color: theme.completedColor, focused: true },
  ];

  const totalTasks =
    (data?.todoTaskCount ?? 0) + (data?.progressTaskCount ?? 0) + (data?.completeTaskCount ?? 0);

  if (totalTasks === 0) {
    return null;
  }

  const todoPercentage = (((data?.todoTaskCount ?? 0) / totalTasks) * 100).toFixed(0);
  const progressPercentage = (((data?.progressTaskCount ?? 0) / totalTasks) * 100).toFixed(0);
  const completePercentage = (((data?.completeTaskCount ?? 0) / totalTasks) * 100).toFixed(0);

  return (
    <View className="bg-background rounded-[20px] overflow-hidden">
      <View className="flex-row">
        <View className="p-5 w-1/2">
          <Text className="text-primary text-[16px] mb-5">Progreso del proyecto</Text>
          <View className="flex-1 gap-2.5 justify-center">
            <PieLabelRow label="Por hacer" percentage={todoPercentage} color={theme.toDoColor} />
            <PieLabelRow
              label="En progreso"
              percentage={progressPercentage}
              color={theme.progressColor}
            />
            <PieLabelRow
              label="Completado"
              percentage={completePercentage}
              color={theme.completedColor}
            />
          </View>
        </View>
        <View className="bg-grey w-[1px]" />
        <View
          className={`items-center flex-row gap-4 justify-center p-[15px] w-1/2 ${isLargeScreen ? 'justify-start px-[15px] py-[15px]' : ''}`}
        >
          <RNPieChart
            data={pieData}
            donut
            sectionAutoFocus
            radius={isLargeScreen ? 55 : 60}
            innerRadius={isLargeScreen ? 35 : 40}
            innerCircleColor={theme.frameBackground}
            isAnimated={true}
            centerLabelComponent={() =>
              !isLargeScreen ? (
                <View className="items-center justify-center">
                  <Text className="text-primary text-[22px] font-bold">{completePercentage}%</Text>
                  <Text className="text-primary text-[14px]">Completado</Text>
                </View>
              ) : null
            }
          />
          {isLargeScreen && (
            <View className="justify-center">
              <Text className="text-primary text-[35px] font-bold">{completePercentage}%</Text>
              <Text className="text-primary text-[18px]">Completado</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const PieLabelRow = ({
  label,
  percentage,
  color,
}: {
  label: string;
  percentage: string;
  color: string;
}) => {
  return (
    <View className="items-center flex-row justify-between">
      <View className="items-center flex-row gap-2">
        <View style={{ backgroundColor: color }} className="rounded-[7px] h-[14px] w-[14px]" />
        <Text className="text-primary text-[16px]">{label}:</Text>
      </View>
      <Text className="text-primary text-[16px] font-bold leading-[18px]">{percentage}%</Text>
    </View>
  );
};

export default DoughnutChart;
