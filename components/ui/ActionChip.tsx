import { Pressable, Text } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

export const ActionChip = ({ label, onPress }: { label: string; onPress: () => void }) => {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: theme.colors.surfacePressed,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 12,
      }}
    >
      <Text style={{ color: theme.colors.textPrimary, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
};
