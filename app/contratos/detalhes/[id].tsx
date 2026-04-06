import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Card } from '../../../components/Card';
import { Header } from '../../../components/Header';
import { Screen } from '../../../components/Screen';
import { AppButton } from '../../../components/ui/AppButton';
import { DetailRow } from '../../../components/ui/DetailRow';
import { EmptyState } from '../../../components/ui/EmptyState';
import { getContractById, getFinishedContractById, type ContractDetails } from '../../../lib/realtime';

export default function ContractDetailsScreen() {
  const { id, finished } = useLocalSearchParams<{ id: string; finished?: string }>();
  const router = useRouter();
  const [item, setItem] = useState<ContractDetails | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const isFinished = finished === '1';
      const contract = isFinished ? await getFinishedContractById(id) : await getContractById(id);
      setItem(contract);
    };

    void load();
  }, [finished, id]);

  if (!item) {
    return (
      <Screen>
        <Header title="Detalhes Contrato" />
        <EmptyState title="Contrato nao encontrado" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Detalhes Contrato" subtitle={item.clienteNome} />
      <Card>
        <DetailRow label="Cliente" value={item.clienteNome} />
        <DetailRow label="NIF" value={item.clienteNif} />
        <DetailRow label="Veiculo" value={item.veiculoId} />
        <DetailRow label="Inicio" value={item.dataInicio} />
        <DetailRow label="Fim previsto" value={item.dataFimPrevista} />
        <DetailRow label="Valor" value={item.valorTotal} />
        <DetailRow label="Status" value={item.status} />
        <DetailRow label="KM saida" value={item.kmSaida} />
        <DetailRow label="Combustivel saida" value={item.combustivelSaida} />
        <DetailRow label="KM entrada" value={item.kmEntrada} />
        <DetailRow label="Combustivel entrada" value={item.combustivelEntrada} />
        <DetailRow label="Danos" value={item.danos} />
        <DetailRow label="Rececao" value={item.notasRececao} />
      </Card>
      {finished === '1' ? null : <AppButton title="Editar" onPress={() => router.push(`/contratos/editar/${item.id}`)} />}
    </Screen>
  );
}
