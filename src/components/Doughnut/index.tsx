import { MyColors } from '@/types/colors';
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart as RNPieChart } from 'react-native-gifted-charts';

const theme = {
  toDoColor: '#FF6B6B',
  progressColor: '#4ECDC4',
  completedColor: '#45B7D1',
  frameBackground: '#FFFFFF',
  textPrimary: '#000000',
  textSecondary: '#666666',
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
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.leftContainer}>
          <Text style={styles.secondaryText}>Project Progress</Text>
          <View style={styles.labelsContainer}>
            <PieLabelRow label="To-Do" percentage={todoPercentage} color={theme.toDoColor} />
            <PieLabelRow
              label="In Progress"
              percentage={progressPercentage}
              color={theme.progressColor}
            />
            <PieLabelRow
              label="Complete"
              percentage={completePercentage}
              color={theme.completedColor}
            />
          </View>
        </View>
        <View style={styles.separator} />
        <View style={[styles.rightContainer, isLargeScreen && styles.rightContainerLarge]}>
          <RNPieChart
            data={pieData}
            donut
            sectionAutoFocus
            radius={isLargeScreen ? 55 : 60}
            innerRadius={isLargeScreen ? 35 : 40}
            innerCircleColor={theme.frameBackground}
            centerLabelComponent={() =>
              !isLargeScreen ? (
                <View style={styles.centerLabel}>
                  <Text style={styles.centerPercentage}>{completePercentage}%</Text>
                  <Text style={styles.centerText}>Complete</Text>
                </View>
              ) : null
            }
          />
          {isLargeScreen && (
            <View style={styles.largeScreenLabel}>
              <Text style={styles.largePercentage}>{completePercentage}%</Text>
              <Text style={styles.largeText}>Complete</Text>
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
    <View style={styles.labelRow}>
      <View style={styles.labelContent}>
        <View style={[styles.colorDot, { backgroundColor: color }]} />
        <Text style={styles.labelText}>{label}:</Text>
      </View>
      <Text style={styles.percentageText}>{percentage}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPercentage: {
    color: theme.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  centerText: {
    color: theme.textPrimary,
    fontSize: 14,
  },
  colorDot: {
    borderRadius: 7,
    height: 14,
    width: 14,
  },
  container: {
    backgroundColor: theme.frameBackground,
    borderRadius: 20,
    overflow: 'hidden',
  },
  labelContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    color: theme.textPrimary,
    fontSize: 16,
  },
  labelsContainer: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
  },
  largePercentage: {
    color: theme.textPrimary,
    fontSize: 35,
    fontWeight: '700',
  },
  largeScreenLabel: {
    justifyContent: 'center',
  },
  largeText: {
    color: theme.textPrimary,
    fontSize: 18,
  },
  leftContainer: {
    padding: 20,
    width: '50%',
  },
  percentageText: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  rightContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    padding: 15,
    width: '50%',
  },
  rightContainerLarge: {
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  row: {
    flexDirection: 'row',
  },
  secondaryText: {
    color: theme.textSecondary,
    fontSize: 16,
    marginBottom: 20,
  },
  separator: {
    backgroundColor: MyColors.GREY,
    width: 1,
  },
});

export default DoughnutChart;
