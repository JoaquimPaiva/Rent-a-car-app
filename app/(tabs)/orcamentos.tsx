import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAppTheme } from '../../hooks/useAppTheme';
import { formatCurrency } from '../../lib/number';
import { subscribeQuotes, type Quote } from '../../lib/realtime';

export default function QuotesTab() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const [list, setList] = useState<Quote[]>([]);

  useEffect(() => {
    return subscribeQuotes((items) => setList(items));
  }, []);

  const summary = useMemo(() => {
    const total = list.reduce((acc, quote) => acc + quote.valorEstimado, 0);
    const approved = list.filter((quote) => (quote.status || '').toLowerCase() === 'aprovado').length;
    const pending = list.filter((quote) => (quote.status || '').toLowerCase() !== 'aprovado').length;
    return { total, approved, pending };
  }, [list]);

  const toneByStatus = (status: string) => {
    const normalized = (status || '').toLowerCase().trim();
    if (normalized === 'aprovado') return 'success' as const;
    if (normalized === 'rejeitado' || normalized === 'cancelado') return 'danger' as const;
    return 'warning' as const;
  };

  const statusLabel = (status: string) => {
    const normalized = (status || '').toLowerCase().trim();
    if (normalized === 'aprovado') return 'Aprovado';
    if (normalized === 'rejeitado') return 'Rejeitado';
    if (normalized === 'cancelado') return 'Cancelado';
    if (normalized === 'pendente') return 'Pendente';
    return status || 'N/D';
  };

  return (
    <Screen>
      <Header title="Orcamentos" subtitle="Pedidos estimados" />

      <View
        style={{
          borderRadius: 18,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          padding: 14,
          gap: 10,
        }}
      >
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: 18,
            fontWeight: '800',
          }}
        >
          {list.length} orcamento{list.length === 1 ? '' : 's'} em carteira
        </Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          Analise pedidos, acompanhe aprovacoes e abra o detalhe para consultar
          cliente e proposta.
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Card
            style={{
              flex: 1,
              backgroundColor: theme.colors.primaryDark,
              borderColor: theme.colors.primaryDark,
              padding: 12,
              gap: 2,
            }}
          >
            <Text style={{ color: theme.colors.textOnPrimary, fontWeight: '700' }}>
              Total estimado
            </Text>
            <Text style={{ color: theme.colors.textOnPrimary, fontSize: 17, fontWeight: '800' }}>
              {formatCurrency(summary.total)}
            </Text>
          </Card>
          <Card style={{ flex: 1, padding: 12, gap: 4 }}>
            <Text style={{ color: theme.colors.textSecondary, fontWeight: '700' }}>
              Aprovados
            </Text>
            <Text style={{ color: theme.colors.success, fontSize: 17, fontWeight: '800' }}>
              {summary.approved}
            </Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
              Pendentes: {summary.pending}
            </Text>
          </Card>
        </View>
      </View>

      {list.length === 0 ? (
        <EmptyState title="Sem orcamentos" subtitle="Os orcamentos em realtime aparecerao aqui." />
      ) : (
        <View style={{ gap: 10 }}>
          {list.map((quote) => (
            <Pressable
              key={quote.id}
              onPress={() => router.push(`/orcamentos/detalhes/${quote.id}`)}
            >
              <Card style={{ gap: 10 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 10,
                  }}
                >
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={{ color: theme.colors.textPrimary, fontWeight: '800', fontSize: 16 }}>
                      {quote.cliente}
                    </Text>
                    <Text style={{ color: theme.colors.textSecondary }}>
                      Orcamento #{quote.id.slice(-6).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={{ color: theme.colors.primary, fontWeight: '800' }}>
                    {formatCurrency(quote.valorEstimado)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <StatusBadge label={statusLabel(quote.status)} tone={toneByStatus(quote.status)} />
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 12, fontWeight: '600' }}>
                    Toque para ver detalhes
                  </Text>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}
