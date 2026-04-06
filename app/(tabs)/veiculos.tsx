import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAppTheme } from '../../hooks/useAppTheme';
import { subscribeVehicles, type Vehicle } from '../../lib/realtime';

export default function VehiclesTab() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const [list, setList] = useState<Vehicle[]>([]);

  useEffect(() => {
    return subscribeVehicles((items) => setList(items));
  }, []);

  return (
    <Screen>
      <Header title="Veiculos" subtitle="Gestao da frota" />
      <Pressable onPress={() => router.push('/veiculos/novo')} style={{ paddingVertical: 8 }}>
        <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>+ Novo Veiculo</Text>
      </Pressable>
      {list.length === 0 ? (
        <EmptyState title="Sem veiculos" subtitle="Crie o primeiro veiculo para comecar." />
      ) : (
        <View style={{ gap: 10 }}>
          {list.map((vehicle) => (
            <Pressable key={vehicle.id} onPress={() => router.push(`/veiculos/detalhes/${vehicle.id}`)}>
              <Card>
                <Text style={{ color: theme.colors.textPrimary, fontWeight: '700' }}>{vehicle.marca} {vehicle.modelo}</Text>
                <Text style={{ color: theme.colors.textSecondary }}>{vehicle.matricula} · {vehicle.km} km</Text>
                <StatusBadge label={vehicle.status} tone={vehicle.status === 'disponivel' ? 'success' : 'warning'} />
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}
