import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../hooks/useAppTheme';

type ScreenProps = ScrollViewProps & {
  children: ReactNode;
  scroll?: boolean;
};

export const Screen = ({ children, scroll = true, contentContainerStyle, ...props }: ScreenProps) => {
  const { theme } = useAppTheme();
  const flattenedStyle = StyleSheet.flatten(props.style) ?? {};
  const { alignItems, justifyContent, ...scrollStyle } = flattenedStyle;
  const contentLayoutStyle = {
    ...(alignItems ? { alignItems } : {}),
    ...(justifyContent ? { justifyContent } : {}),
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {scroll ? (
        <ScrollView
          {...props}
          keyboardShouldPersistTaps="handled"
          style={[{ flex: 1 }, scrollStyle]}
          contentContainerStyle={[{ padding: 16, gap: 12 }, contentLayoutStyle, contentContainerStyle]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, padding: 16 }}>{children}</View>
      )}
    </SafeAreaView>
  );
};
