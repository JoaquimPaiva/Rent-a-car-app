import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Header } from '../../components/Header';
import { Screen } from '../../components/Screen';
import { AppButton } from '../../components/ui/AppButton';
import { FormField } from '../../components/ui/FormField';
import { InlineMessage } from '../../components/ui/InlineMessage';
import { createVehicle } from '../../lib/realtime';

export default function NewVehicleScreen() {
  const router = useRouter();
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [matricula, setMatricula] = useState('');
  const [ano, setAno] = useState('');
  const [km, setKm] = useState('');
  const [combustivel, setCombustivel] = useState('Gasolina');
  const [status, setStatus] = useState('disponivel');
  const [notas, setNotas] = useState('');
  const [message, setMessage] = useState('');

  const submit = async () => {
    if (!marca || !modelo || !matricula) {
      setMessage('Preencha marca, modelo e matricula.');
      return;
    }

    await createVehicle({
      marca,
      modelo,
      matricula,
      ano: Number(ano) || 0,
      km: Number(km) || 0,
      combustivel,
      status,
      notas,
    });

    router.replace('/(tabs)/veiculos');
  };

  return (
    <Screen className="px-4 py-6">
      <Header title="Novo Veiculo" subtitle="Criacao de viatura" />
      {message ? <InlineMessage type="error" message={message} /> : null}
      <FormField label="Marca" value={marca} onChangeText={setMarca} />
      <FormField label="Modelo" value={modelo} onChangeText={setModelo} />
      <FormField label="Matricula" value={matricula} onChangeText={setMatricula} />
      <FormField label="Ano" value={ano} onChangeText={setAno} keyboardType="numeric" />
      <FormField label="KM" value={km} onChangeText={setKm} keyboardType="numeric" />
      <FormField label="Combustivel" value={combustivel} onChangeText={setCombustivel} />
      <FormField label="Status" value={status} onChangeText={setStatus} />
      <FormField label="Notas" value={notas} onChangeText={setNotas} multiline />
      <AppButton title="Guardar" onPress={() => void submit()} />
    </Screen>
  );
}
