import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { AppButton } from '../../components/ui/AppButton';
import { FormField } from '../../components/ui/FormField';
import { InlineMessage } from '../../components/ui/InlineMessage';
import { createContract } from '../../lib/realtime';

export default function NewContractScreen() {
  const router = useRouter();
  const [clienteNome, setClienteNome] = useState('');
  const [clienteNif, setClienteNif] = useState('');
  const [veiculoId, setVeiculoId] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFimPrevista, setDataFimPrevista] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [status, setStatus] = useState('aberto');
  const [notas, setNotas] = useState('');
  const [kmSaida, setKmSaida] = useState('');
  const [combustivelSaida, setCombustivelSaida] = useState('');
  const [message, setMessage] = useState('');

  const submit = async () => {
    if (!clienteNome || !veiculoId || !dataInicio) {
      setMessage('Preencha cliente, veiculo e data inicio.');
      return;
    }

    await createContract({
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

    router.replace('/(tabs)/contratos');
  };

  return (
    <Screen className="px-4 py-6">
      <Header title="Novo Contrato" subtitle="Criacao de aluguer" />
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
      <AppButton title="Guardar" onPress={() => void submit()} />
    </Screen>
  );
}
