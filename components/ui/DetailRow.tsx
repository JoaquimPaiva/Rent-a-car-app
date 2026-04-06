import { Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

export const DetailRow = ({ label, value }: { label: string; value: string | number | undefined | null }) => {
  const { theme } = useAppTheme();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
      <Text style={{ color: theme.colors.textSecondary, flex: 1 }}>{label}</Text>
      <Text style={{ color: theme.colors.textPrimary, flex: 1, textAlign: 'right' }}>{value ?? 'N/D'}</Text>
    </View>
  );
};
