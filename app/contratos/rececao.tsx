import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { AppButton } from '../../components/ui/AppButton';
import { FormField } from '../../components/ui/FormField';
import { InlineMessage } from '../../components/ui/InlineMessage';
import { finalizeContract } from '../../lib/realtime';

export default function ReceptionScreen() {
  const router = useRouter();
  const [contractId, setContractId] = useState('');
  const [kmEntrada, setKmEntrada] = useState('');
  const [combustivelEntrada, setCombustivelEntrada] = useState('');
  const [danos, setDanos] = useState('');
  const [notas, setNotas] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    if (!contractId) {
      setError('Indique o ID do contrato.');
      return;
    }

    try {
      await finalizeContract({
        contractId,
        kmEntrada: Number(kmEntrada) || 0,
        combustivelEntrada,
        danos,
        notas,
      });
      setError('');
      setMessage('Contrato finalizado com sucesso.');
      router.replace('/(tabs)/finalizados');
    } catch (err) {
      setMessage('');
      setError(err instanceof Error ? err.message : 'Falha na finalizacao.');
    }
  };

  return (
    <Screen className="px-4 py-6">
      <Header title="Rececao" subtitle="Finalizar contrato" />
      {message ? <InlineMessage type="success" message={message} /> : null}
      {error ? <InlineMessage type="error" message={error} /> : null}
      <FormField label="Contract ID" value={contractId} onChangeText={setContractId} />
      <FormField label="KM Entrada" value={kmEntrada} onChangeText={setKmEntrada} keyboardType="numeric" />
      <FormField label="Combustivel Entrada" value={combustivelEntrada} onChangeText={setCombustivelEntrada} />
      <FormField label="Danos" value={danos} onChangeText={setDanos} multiline />
      <FormField label="Notas" value={notas} onChangeText={setNotas} multiline />
      <AppButton title="Finalizar Contrato" variant="success" onPress={() => void submit()} />
    </Screen>
  );
}
