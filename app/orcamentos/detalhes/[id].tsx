import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../../components/Card';
import { Header } from '../../../components/Header';
import { Screen } from '../../../components/Screen';
import { AppButton } from '../../../components/ui/AppButton';
import { DetailRow } from '../../../components/ui/DetailRow';
import { EmptyState } from '../../../components/ui/EmptyState';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { formatCurrency } from '../../../lib/number';
import { getQuoteById, type QuoteDetails } from '../../../lib/realtime';

const toDateLabel = (value?: string | number) => {
  if (value === undefined || value === null || value === '') return 'N/D';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString();
};

const toDateTimeLabel = (value?: string | number) => {
  if (value === undefined || value === null || value === '') return 'N/D';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
};

const statusTone = (status: string) => {
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

export default function QuoteDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useAppTheme();
  const [item, setItem] = useState<QuoteDetails | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const quote = await getQuoteById(id);
      setItem(quote);
    };

    void load();
  }, [id]);

  const vehicleLabel = useMemo(() => {
    if (!item) return 'N/D';
    if (item.veiculoNome) return item.veiculoNome;
    if (item.veiculoId) return item.veiculoId;
    return 'Nao definido';
  }, [item]);

  if (!item) {
    return (
      <Screen>
        <Header title="Detalhes Orcamento" />
        <EmptyState title="Orcamento nao encontrado" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Detalhes Orcamento" subtitle={item.cliente} />

      <Card
        style={{
          backgroundColor: theme.colors.primaryDark,
          borderColor: theme.colors.primaryDark,
          gap: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={{ color: theme.colors.textOnPrimary, fontSize: 13 }}>
              Valor total
            </Text>
            <Text style={{ color: theme.colors.textOnPrimary, fontSize: 24, fontWeight: '800' }}>
              {formatCurrency(item.valorEstimado)}
            </Text>
          </View>
          <StatusBadge label={statusLabel(item.status)} tone={statusTone(item.status)} />
        </View>
        <Text style={{ color: theme.colors.textOnPrimary, opacity: 0.9 }}>
          Referencia #{item.id.slice(-6).toUpperCase()}
        </Text>
      </Card>

      <Card style={{ gap: 10 }}>
        <Text style={{ color: theme.colors.textPrimary, fontWeight: '800', fontSize: 16 }}>
          Cliente
        </Text>
        <DetailRow label="Nome" value={item.cliente} />
        <DetailRow label="NIF" value={item.clienteNif} />
        <DetailRow label="Telefone" value={item.clienteTelefone} />
        <DetailRow label="Email" value={item.clienteEmail} />
        <DetailRow label="Tipo" value={item.clienteTipo} />
        <DetailRow label="Morada" value={item.clienteMorada} />
      </Card>

      <Card style={{ gap: 10 }}>
        <Text style={{ color: theme.colors.textPrimary, fontWeight: '800', fontSize: 16 }}>
          Orcamento
        </Text>
        <DetailRow label="Veiculo" value={vehicleLabel} />
        <DetailRow label="Matricula" value={item.veiculoMatricula} />
        <DetailRow label="Periodo inicio" value={toDateLabel(item.periodoInicio)} />
        <DetailRow label="Periodo fim" value={toDateLabel(item.periodoFim)} />
        <DetailRow label="Dias" value={item.periodoDias} />
        <DetailRow
          label="Preco diario"
          value={item.precoDiario !== undefined ? formatCurrency(item.precoDiario) : 'N/D'}
        />
        <DetailRow
          label="Taxas"
          value={item.taxas !== undefined ? formatCurrency(item.taxas) : 'N/D'}
        />
        <DetailRow
          label="Desconto"
          value={item.desconto !== undefined ? formatCurrency(item.desconto) : 'N/D'}
        />
        <DetailRow label="Validade (dias)" value={item.validadeDias} />
        <DetailRow label="Data orcamento" value={toDateTimeLabel(item.dataOrcamento)} />
        <DetailRow label="Canal de envio" value={item.sentMethod} />
      </Card>

      <Card style={{ gap: 10 }}>
        <Text style={{ color: theme.colors.textPrimary, fontWeight: '800', fontSize: 16 }}>
          Observacoes
        </Text>
        <Text style={{ color: theme.colors.textSecondary }}>
          {item.observacoes || 'Sem observacoes.'}
        </Text>
        <DetailRow label="Contrato associado" value={item.contractId} />
        <DetailRow label="Criado em" value={toDateTimeLabel(item.createdTs)} />
        <DetailRow label="Atualizado em" value={toDateTimeLabel(item.updatedTs)} />
      </Card>

      <AppButton title="Voltar para Orcamentos" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}
