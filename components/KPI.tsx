import { Text, View } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { Card } from './Card';

export const KPI = ({ label, value }: { label: string; value: number | string }) => {
  const { theme } = useAppTheme();

  return (
    <Card style={{ flex: 1 }}>
      <View style={{ gap: 8 }}>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>{label}</Text>
        <Text style={{ color: theme.colors.textPrimary, fontSize: 24, fontWeight: '700' }}>{value}</Text>
      </View>
    </Card>
  );
};
