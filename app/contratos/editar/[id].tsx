import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Header } from '../../../components/Header';
import { Screen } from '../../../components/Screen';
import { AppButton } from '../../../components/ui/AppButton';
import { FormField } from '../../../components/ui/FormField';
import { InlineMessage } from '../../../components/ui/InlineMessage';
import { getContractById, updateContract } from '../../../lib/realtime';

export default function EditContractScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [clienteNome, setClienteNome] = useState('');
  const [clienteNif, setClienteNif] = useState('');
  const [veiculoId, setVeiculoId] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFimPrevista, setDataFimPrevista] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [status, setStatus] = useState('');
  const [notas, setNotas] = useState('');
  const [kmSaida, setKmSaida] = useState('');
  const [combustivelSaida, setCombustivelSaida] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const contract = await getContractById(id);
      if (!contract) {
        setMessage('Contrato nao encontrado.');
        return;
      }

      setClienteNome(contract.clienteNome);
      setClienteNif(contract.clienteNif);
      setVeiculoId(contract.veiculoId);
      setDataInicio(contract.dataInicio);
      setDataFimPrevista(contract.dataFimPrevista);
      setValorTotal(String(contract.valorTotal || ''));
      setStatus(contract.status);
      setNotas(contract.notas);
      setKmSaida(String(contract.kmSaida || ''));
      setCombustivelSaida(contract.combustivelSaida);
    };

    void load();
  }, [id]);

  const submit = async () => {
    if (!id) return;
    if (!clienteNome || !veiculoId || !dataInicio) {
      setMessage('Preencha cliente, veiculo e data inicio.');
      return;
    }

    await updateContract(id, {
      clienteNome,
      clienteNif,
      veiculoId,
      dataInicio,
      dataFimPrevista,
      valorTotal: Number(valorTotal) || 0,
      status,
      notas,
      kmSaida: Number(kmSaida) || 0,
      combustivelSaida,
    });

    router.replace(`/contratos/detalhes/${id}`);
  };

  return (
    <Screen>
      <Header title="Editar Contrato" />
      {message ? <InlineMessage type="error" message={message} /> : null}
      <FormField label="Cliente" value={clienteNome} onChangeText={setClienteNome} />
      <FormField label="NIF" value={clienteNif} onChangeText={setClienteNif} keyboardType="numeric" />
      <FormField label="Veiculo ID" value={veiculoId} onChangeText={setVeiculoId} />
      <FormField label="Data Inicio" value={dataInicio} onChangeText={setDataInicio} placeholder="YYYY-MM-DD" />
      <FormField label="Data Fim Prevista" value={dataFimPrevista} onChangeText={setDataFimPrevista} placeholder="YYYY-MM-DD" />
      <FormField label="Valor Total" value={valorTotal} onChangeText={setValorTotal} keyboardType="numeric" />
      <FormField label="KM Saida" value={kmSaida} onChangeText={setKmSaida} keyboardType="numeric" />
      <FormField label="Combustivel Saida" value={combustivelSaida} onChangeText={setCombustivelSaida} />
      <FormField label="Status" value={status} onChangeText={setStatus} />
      <FormField label="Notas" value={notas} onChangeText={setNotas} multiline />
      <AppButton title="Atualizar" onPress={() => void submit()} />
    </Screen>
  );
}
