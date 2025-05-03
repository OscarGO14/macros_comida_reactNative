export type GradientButtonVariant = 'primary' | 'secondary' | 'accent';
export type GradientButtonSize = 'sm' | 'md' | 'lg';

export interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: GradientButtonVariant;
  size?: GradientButtonSize;
  gradient?: boolean;
  disabled?: boolean;
  className?: string;
}
