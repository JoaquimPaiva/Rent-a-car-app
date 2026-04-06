import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { ThemeToggleButton } from './ThemeToggleButton';

export const Header = ({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: theme.colors.textPrimary }}>{title}</Text>
        {subtitle ? <Text style={{ color: theme.colors.textSecondary }}>{subtitle}</Text> : null}
      </View>
      {right ?? <ThemeToggleButton />}
    </View>
  );
};
