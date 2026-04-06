import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

const IOSNativeTabs = () => {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'rectangle.3.offgrid', selected: 'rectangle.3.offgrid.fill' }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="veiculos" role="search">
        <Icon sf={{ default: 'car', selected: 'car.fill' }} />
        <Label>Cars</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="contratos">
        <Icon sf={{ default: 'doc.text', selected: 'doc.text.fill' }} />
        <Label>Open</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="orcamentos">
        <Icon sf={{ default: 'dollarsign.circle', selected: 'dollarsign.circle.fill' }} />
        <Label>planner</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="finalizados">
        <Icon sf={{ default: 'checkmark.seal', selected: 'checkmark.seal.fill' }} />
        <Label>Ended</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default function TabsLayout() {
  const { theme } = useAppTheme();

  if (Platform.OS === 'ios') {
    return <IOSNativeTabs />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarActiveTintColor: theme.colors.tabActive,
        tabBarInactiveTintColor: theme.colors.tabInactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'speedometer' : 'speedometer-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="veiculos"
        options={{
          title: 'Veiculos',
          tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'car' : 'car-outline'} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contratos"
        options={{
          title: 'Contratos',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orcamentos"
        options={{
          title: 'Orcamentos',
          tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'cash' : 'cash-outline'} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="finalizados"
        options={{
          title: 'Finalizados',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'checkmark-done' : 'checkmark-done-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
