import { Pressable, Text } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

export const LinkButton = ({ label, onPress }: { label: string; onPress: () => void }) => {
  const { theme } = useAppTheme();

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Text style={{ color: theme.colors.primary, fontWeight: '600', textAlign: 'center' }}>{label}</Text>
    </Pressable>
  );
};
