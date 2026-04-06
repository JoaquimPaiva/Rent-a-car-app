import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AppButton } from '../../components/ui/AppButton';
import { Header } from '../../components/Header';
import { KPI } from '../../components/KPI';
import { LogoutButton } from '../../components/LogoutButton';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { ActionChip } from '../../components/ui/ActionChip';
import { EmptyState } from '../../components/ui/EmptyState';
import { InlineMessage } from '../../components/ui/InlineMessage';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAppTheme } from '../../hooks/useAppTheme';
import { formatCurrency } from '../../lib/number';
import { subscribeDashboardStats, type DashboardStats } from '../../lib/realtime';

const INITIAL: DashboardStats = {
  totalVeiculos: 0,
  totalContratosAbertos: 0,
  totalContratosFinalizados: 0,
  totalOrcamentos: 0,
  contratosRecentes: [],
  syncState: 'syncing',
};

export default function DashboardScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const [stats, setStats] = useState<DashboardStats>(INITIAL);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeDashboardStats(
      (data) => {
        setStats(data);
      },
      (err) => setError(err.message),
    );

    return unsubscribe;
  }, []);

  const syncTone = stats.syncState === 'error' ? 'danger' : stats.syncState === 'synced' ? 'success' : 'warning';
  const syncText =
    stats.syncState === 'error'
      ? 'Sincronizacao com erro'
      : stats.syncState === 'synced'
      ? 'Ligado em tempo real'
      : 'A sincronizar dados';

  return (
    <Screen>
      <Header title="Dashboard" subtitle="Visao operacional" right={<LogoutButton />} />

      <View
        style={{
          borderRadius: 20,
          padding: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.primaryDark,
          gap: 10,
        }}
      >
        <Text style={{ color: theme.colors.textOnPrimary, fontSize: 22, fontWeight: '800' }}>Centro de Operacoes</Text>
        <Text style={{ color: theme.colors.textOnPrimary, opacity: 0.9 }}>
          Monitoriza frota, contratos ativos e progresso diario a partir daqui.
        </Text>
        <View style={{ alignSelf: 'flex-start' }}>
          <StatusBadge label={syncText} tone={syncTone} />
        </View>
      </View>

      {/* {error ? <InlineMessage type="error" message={error} /> : null}
      {!error ? <InlineMessage type={stats.syncState === 'synced' ? 'success' : 'info'} message={`${syncText}.`} /> : null} */}

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <KPI label="Veiculos" value={stats.totalVeiculos} />
        <KPI label="Abertos" value={stats.totalContratosAbertos} />
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <KPI label="Finalizados" value={stats.totalContratosFinalizados} />
        <KPI label="Orcamentos" value={stats.totalOrcamentos} />
      </View>

      <Card>
        <Text style={{ color: theme.colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 10 }}>Acoes Rapidas</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10, justifyContent: 'space-between' }}>
          <ActionChip label="Novo veiculo" onPress={() => router.push('/veiculos/novo')} />
          <ActionChip label="Novo contrato" onPress={() => router.push('/contratos/novo')} />
          <ActionChip label="Rececao" onPress={() => router.push('/contratos/rececao')} />
        </View>
        <AppButton title="Ir para Contratos" variant="secondary" onPress={() => router.push('/contratos')} />
      </Card>

      <Card>
        <Text style={{ color: theme.colors.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 10 }}>Contratos recentes</Text>
        {stats.contratosRecentes.length ? (
          <View style={{ gap: 8 }}>
            {stats.contratosRecentes.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/contratos/detalhes/${item.id}`)}
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 12,
                  backgroundColor: theme.colors.surfacePressed,
                  padding: 10,
                  gap: 4,
                }}
              >
                <Text style={{ color: theme.colors.textPrimary, fontWeight: '700' }}>{item.clienteNome}</Text>
                <Text style={{ color: theme.colors.textSecondary }}>{item.veiculoId || 'Sem veiculo'}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <StatusBadge label={item.status} tone={item.status === 'finalizado' ? 'success' : 'brand'} />
                  <Text style={{ color: theme.colors.textSecondary, fontWeight: '600' }}>{formatCurrency(item.valorTotal)}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <EmptyState title="Sem contratos recentes" subtitle="Quando existirem contratos abertos, aparecerao aqui." />
        )}
      </Card>
    </Screen>
  );
}
