import { Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'brand';

export const StatusBadge = ({ label, tone = 'neutral' }: { label: string; tone?: BadgeTone }) => {
  const { theme } = useAppTheme();

  const bg =
    tone === 'success'
      ? theme.colors.success
      : tone === 'warning'
      ? theme.colors.warning
      : tone === 'danger'
      ? theme.colors.error
      : tone === 'brand'
      ? theme.colors.primary
      : theme.colors.surfacePressed;

  const color = tone === 'neutral' ? theme.colors.textPrimary : theme.colors.textOnPrimary;

  return (
    <View style={{ alignSelf: 'flex-start', backgroundColor: bg, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10 }}>
      <Text style={{ color, fontSize: 12, fontWeight: '700' }}>{label}</Text>
    </View>
  );
};
