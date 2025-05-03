export type StatsCardVariant = 'primary' | 'secondary' | 'accent';
export type StatsCardSize = 'sm' | 'md' | 'lg';

export interface StatsCardProps {
  title: string;
  value: number;
  variant?: StatsCardVariant;
  size?: StatsCardSize;
  trend?: string;
  formatValue?: (value: number) => string;
  children?: React.ReactNode;
  className?: string;
}
