import { Pressable, Text } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useAppTheme } from '../hooks/useAppTheme';

export const LogoutButton = () => {
  const { signOutUser } = useAuth();
  const { theme } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Terminar sessao"
      onPress={async () => {
        await signOutUser();
      }}
      style={{
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
      }}
    >
      <Text style={{ color: theme.colors.error, fontWeight: '700' }}>Sair</Text>
    </Pressable>
  );
};
