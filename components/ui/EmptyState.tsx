import { Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

export const EmptyState = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  const { theme } = useAppTheme();

  return (
    <View style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 16, alignItems: 'center', gap: 6 }}>
      <Text style={{ color: theme.colors.textPrimary, fontWeight: '700' }}>{title}</Text>
      {subtitle ? <Text style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>{subtitle}</Text> : null}
    </View>
  );
};
