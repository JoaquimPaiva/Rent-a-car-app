import { Pressable, Text } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

export const ThemeToggleButton = () => {
  const { mode, toggleTheme, theme } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Alternar tema"
      onPress={() => void toggleTheme()}
      style={{
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: theme.colors.surface,
      }}
    >
      <Text style={{ color: theme.colors.textPrimary, fontWeight: '600' }}>{mode === 'dark' ? 'Claro' : 'Escuro'}</Text>
    </Pressable>
  );
};
