import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { BarChart, barDataItem } from 'react-native-gifted-charts';
import { MyColors } from '@/types/colors';
import { DayOfWeek, dayOfWeekArray, History } from '@/types/history';
import { createEmptyDailyLog } from '@/utils/createEmpytDailyLog';
import { formatDay } from '@/utils/translator';

const fallbackHistory: History = {
  monday: createEmptyDailyLog(),
  tuesday: createEmptyDailyLog(),
  wednesday: createEmptyDailyLog(),
  thursday: createEmptyDailyLog(),
  friday: createEmptyDailyLog(),
  saturday: createEmptyDailyLog(),
  sunday: createEmptyDailyLog(),
};

const BarChartComponent = ({
  history = fallbackHistory,
  today,
  dailyGoal = 1700,
}: {
  history?: History;
  today: DayOfWeek;
  dailyGoal?: number;
}) => {
  const daysArray = useMemo(() => {
    const todayIndex = dayOfWeekArray.indexOf(today);

    const daysArray = [
      ...dayOfWeekArray.slice(todayIndex + 1),
      ...dayOfWeekArray.slice(0, todayIndex + 1),
    ];
    return daysArray;
  }, [today]);

  const barData = useMemo(
    () =>
      daysArray.map((item) => {
        const dayCalories = history?.[item]?.totalMacros?.calories;
        const frontColor = () => {
          if (dayCalories) {
            if (dayCalories > dailyGoal * 0.9 && dayCalories < dailyGoal * 1.05)
              return MyColors.ACCENT;
            if (dayCalories < dailyGoal * 0.9) return MyColors.PRIMARY;
            if (dayCalories > dailyGoal * 1.05) return MyColors.DANGER;
          }
          return MyColors.ALTERNATE;
        };
        const labelTextStyle = () => {
          if (item === today) {
            return MyColors.ACCENT;
          }
          return MyColors.ALTERNATE;
        };
        return {
          value: dayCalories ?? 0,
          label: formatDay(item),
          frontColor: frontColor(),
          labelTextStyle: { color: labelTextStyle() },
        };
      }),
    [history, dailyGoal],
  );

  return (
    <View className="flex-col items-center justify-center w-full rounded-lg">
      <Text className="text-lg font-semibold text-alternate">Tus últimos 7 Días</Text>
      <BarChart
        data={barData}
        barWidth={22}
        spacing={18}
        roundedTop
        roundedBottom
        hideRules
        noOfSections={5}
        maxValue={2200}
        isAnimated
        rulesType="solid"
        rulesColor={MyColors.ACCENT}
        rulesThickness={2}
        showReferenceLine1
        referenceLine1Position={dailyGoal}
        referenceLine1Config={{
          color: MyColors.ACCENT,
          dashWidth: 2,
          dashGap: 3,
        }}
        xAxisColor={MyColors.ALTERNATE}
        yAxisColor={MyColors.ALTERNATE}
        yAxisTextStyle={{ color: MyColors.ALTERNATE }}
        renderTooltip={(item: barDataItem) => (
          <View
            style={{
              marginBottom: 10,
              marginLeft: -10,
              backgroundColor: MyColors.ALTERNATE,
              paddingHorizontal: 6,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: MyColors.PRIMARY, fontSize: 10 }}>{`${item.value} kcal`}</Text>
          </View>
        )}
      />
      <View className="flex-row gap-2 mt-2">
        <View className="h-2.5 w-2.5 bg-accent mr-1 p-2 rotate-45"></View>
        <Text className="text-xs text-primary">Objetivo: {dailyGoal} kcal</Text>
      </View>
    </View>
  );
};

export default BarChartComponent;
