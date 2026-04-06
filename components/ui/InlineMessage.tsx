import { Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

export const InlineMessage = ({
  type,
  message,
}: {
  type: 'info' | 'error' | 'success';
  message: string;
}) => {
  const { theme } = useAppTheme();

  const color = type === 'error' ? theme.colors.error : type === 'success' ? theme.colors.success : theme.colors.accent;

  return (
    <View style={{ borderLeftWidth: 3, borderLeftColor: color, paddingLeft: 10, paddingVertical: 6 }}>
      <Text style={{ color: theme.colors.textPrimary }}>{message}</Text>
    </View>
  );
};
