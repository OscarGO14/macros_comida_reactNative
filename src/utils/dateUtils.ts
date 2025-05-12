// src/utils/dateUtils.ts
import { Timestamp } from 'firebase/firestore';

// Función para verificar si dos fechas son del mismo día
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Función para crear una fecha a partir de un día de la semana (0-6 donde 0 es domingo)
export const getCurrentWeekDate = (dayOfWeek: number): Date => {
  const today = new Date();
  const currentDay = today.getDay(); // 0-6 (0 es domingo)
  const diff = dayOfWeek - currentDay;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);
  return targetDate;
};

// Función para verificar si un timestamp es de hoy
export const isFromToday = (timestamp: Timestamp): boolean => {
  const firebaseDate = timestamp.toDate();
  const today = new Date();
  return isSameDay(firebaseDate, today);
};
