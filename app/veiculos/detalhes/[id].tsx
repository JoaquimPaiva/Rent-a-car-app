import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Card } from '../../../components/Card';
import { Header } from '../../../components/Header';
import { Screen } from '../../../components/Screen';
import { AppButton } from '../../../components/ui/AppButton';
import { DetailRow } from '../../../components/ui/DetailRow';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { getVehicleById, type Vehicle } from '../../../lib/realtime';

export default function VehicleDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useAppTheme();
  const [item, setItem] = useState<Vehicle | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setItem(await getVehicleById(id));
    };

    void load();
  }, [id]);

  if (!item) {
    return (
      <Screen>
        <Header title="Detalhes Veiculo" />
        <EmptyState title="Veiculo nao encontrado" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Detalhes Veiculo" subtitle={`${item.marca} ${item.modelo}`} />
      <Card>
        <DetailRow label="Marca" value={item.marca} />
        <DetailRow label="Modelo" value={item.modelo} />
        <DetailRow label="Matricula" value={item.matricula} />
        <DetailRow label="Ano" value={item.ano} />
        <DetailRow label="KM" value={item.km} />
        <DetailRow label="Combustivel" value={item.combustivel} />
        <DetailRow label="Status" value={item.status} />
      </Card>
      <Text style={{ color: theme.colors.textSecondary }}>{item.notas}</Text>
      <AppButton title="Editar" onPress={() => router.push(`/veiculos/editar/${item.id}`)} />
    </Screen>
  );
}
