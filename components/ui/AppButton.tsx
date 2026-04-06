import { Pressable, Text } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

type Variant = 'primary' | 'success' | 'secondary';

export const AppButton = ({
  title,
  onPress,
  disabled,
  variant = 'primary',
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: Variant;
}) => {
  const { theme } = useAppTheme();

  const backgroundColor =
    variant === 'primary'
      ? theme.colors.primary
      : variant === 'success'
      ? theme.colors.success
      : theme.colors.surfacePressed;

  const textColor = variant === 'secondary' ? theme.colors.textPrimary : theme.colors.textOnPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text style={{ color: textColor, textAlign: 'center', fontWeight: '700' }}>{title}</Text>
    </Pressable>
  );
};
