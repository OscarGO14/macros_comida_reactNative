import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { MyColors } from '@/types/colors';

const BarChartComponent = () => {
  const dailyGoal = 1700;
  const barData = [
    {
      value: 1500,
      label: 'L',
      frontColor: dailyGoal > 1500 ? MyColors.ACCENT : MyColors.DANGER,
      labelTextStyle: { color: MyColors.ALT },
    },
    {
      value: 1800,
      label: 'M',
      frontColor: dailyGoal > 1800 ? MyColors.ACCENT : MyColors.DANGER,
      labelTextStyle: { color: MyColors.ALT },
    },
    {
      value: 1600,
      label: 'X',
      frontColor: dailyGoal > 1600 ? MyColors.ACCENT : MyColors.DANGER,
      labelTextStyle: { color: MyColors.ALT },
    },
    {
      value: 1950,
      label: 'J',
      frontColor: dailyGoal > 1950 ? MyColors.ACCENT : MyColors.DANGER,
      labelTextStyle: { color: MyColors.ALT },
    },
    {
      value: 1400,
      label: 'V',
      frontColor: dailyGoal > 1400 ? MyColors.ACCENT : MyColors.DANGER,
      labelTextStyle: { color: MyColors.ALT },
    },
    {
      value: 2100,
      label: 'S',
      frontColor: dailyGoal > 2100 ? MyColors.ACCENT : MyColors.DANGER,
      labelTextStyle: { color: MyColors.ALT },
    },
    {
      value: 1750,
      label: 'D',
      frontColor: dailyGoal > 1750 ? MyColors.ACCENT : MyColors.DANGER,
      labelTextStyle: { color: MyColors.ALT },
    },
  ];

  return (
    <View className="flex-col items-center justify-center w-full rounded-lg">
      <Text className="text-lg font-semibold text-alternate">Consumo Semanal (kcal)</Text>
      <BarChart
        data={barData}
        barWidth={22}
        spacing={18}
        roundedTop
        roundedBottom
        hideRules
        noOfSections={5}
        maxValue={2500}
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
        renderTooltip={(item: any) => (
          <View
            style={{
              marginBottom: 10,
              marginLeft: -10,
              backgroundColor: MyColors.ALT,
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
