import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAppTheme } from '../../hooks/useAppTheme';
import { subscribeFinishedContracts, type ContractDetails } from '../../lib/realtime';

export default function FinalizedTab() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const [list, setList] = useState<ContractDetails[]>([]);

  useEffect(() => {
    return subscribeFinishedContracts((items) => setList(items));
  }, []);

  return (
    <Screen>
      <Header title="Finalizados" subtitle="Contratos encerrados" />
      {list.length === 0 ? (
        <EmptyState title="Sem contratos finalizados" />
      ) : (
        <View style={{ gap: 10 }}>
          {list.map((contract) => (
            <Pressable key={contract.id} onPress={() => router.push(`/contratos/detalhes/${contract.id}?finished=1`)}>
              <Card>
                <Text style={{ color: theme.colors.textPrimary, fontWeight: '700' }}>{contract.clienteNome}</Text>
                <Text style={{ color: theme.colors.textSecondary }}>{contract.dataFinalizacao || 'Finalizado'}</Text>
                <StatusBadge label="finalizado" tone="success" />
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}
