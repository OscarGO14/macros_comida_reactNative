// TODO: Implementar guardado en Firestore

import { DayOfWeek } from '@/types/history';
import { Alert } from 'react-native';

// Coger el DailyLog del día actual
export const getDayOfWeek = (): DayOfWeek => {
  const today = new Date();
  // Get day name in lowercase English to match the keys
  const dayString = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  // Optional but recommended: Validate the generated string before assertion
  const validDays: DayOfWeek[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  if (!validDays.includes(dayString as DayOfWeek)) {
    console.error('Error getting day of week:', dayString);
    Alert.alert('Error interno', 'No se pudo determinar el día de la semana.');
    return 'monday' as DayOfWeek; // default value
  }
  return dayString as DayOfWeek;
};
