import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../hooks/useAuth";
import { ThemeProvider, useAppTheme } from "../hooks/useAppTheme";
import "../global.css";

const GuardedLayout = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { theme } = useAppTheme();
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (loading) return;

    if (!user && !isAuthRoute) {
      router.replace("/login");
      return;
    }

    if (user && isAuthRoute) {
      router.replace("/veiculos");
    }
  }, [isAuthRoute, loading, router, user]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="veiculos/novo"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [0.45, 1],
          sheetGrabberVisible: true,
        }}
      />
      <Stack.Screen
        name="veiculos/editar/[id]"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [0.45, 1],
          sheetGrabberVisible: true,
        }}
      />
      <Stack.Screen name="veiculos/detalhes/[id]" />
      <Stack.Screen
        name="contratos/novo"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [0.45, 1],
          sheetGrabberVisible: true,
        }}
      />
      <Stack.Screen
        name="contratos/editar/[id]"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [0.45, 1],
          sheetGrabberVisible: true,
        }}
      />
      <Stack.Screen name="contratos/detalhes/[id]" />
      <Stack.Screen
        name="contratos/rececao"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [0.45, 1],
          sheetGrabberVisible: true,
        }}
      />
      <Stack.Screen name="orcamentos/detalhes/[id]" />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GuardedLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
