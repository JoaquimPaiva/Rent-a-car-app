import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Header } from '../../../components/Header';
import { Screen } from '../../../components/Screen';
import { AppButton } from '../../../components/ui/AppButton';
import { FormField } from '../../../components/ui/FormField';
import { InlineMessage } from '../../../components/ui/InlineMessage';
import { getVehicleById, updateVehicle } from '../../../lib/realtime';

export default function EditVehicleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [matricula, setMatricula] = useState('');
  const [ano, setAno] = useState('');
  const [km, setKm] = useState('');
  const [combustivel, setCombustivel] = useState('');
  const [status, setStatus] = useState('');
  const [notas, setNotas] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const vehicle = await getVehicleById(id);
      if (!vehicle) {
        setMessage('Veiculo nao encontrado.');
        return;
      }

      setMarca(vehicle.marca);
      setModelo(vehicle.modelo);
      setMatricula(vehicle.matricula);
      setAno(String(vehicle.ano || ''));
      setKm(String(vehicle.km || ''));
      setCombustivel(vehicle.combustivel);
      setStatus(vehicle.status);
      setNotas(vehicle.notas);
    };

    void load();
  }, [id]);

  const submit = async () => {
    if (!id) return;
    if (!marca || !modelo || !matricula) {
      setMessage('Preencha marca, modelo e matricula.');
      return;
    }

    await updateVehicle(id, {
      marca,
      modelo,
      matricula,
      ano: Number(ano) || 0,
      km: Number(km) || 0,
      combustivel,
      status,
      notas,
    });

    router.replace(`/veiculos/detalhes/${id}`);
  };

  return (
    <Screen className="px-4 py-6">
      <Header title="Editar Veiculo" />
      {message ? <InlineMessage type="error" message={message} /> : null}
      <FormField label="Marca" value={marca} onChangeText={setMarca} />
      <FormField label="Modelo" value={modelo} onChangeText={setModelo} />
      <FormField label="Matricula" value={matricula} onChangeText={setMatricula} />
      <FormField label="Ano" value={ano} onChangeText={setAno} keyboardType="numeric" />
      <FormField label="KM" value={km} onChangeText={setKm} keyboardType="numeric" />
      <FormField label="Combustivel" value={combustivel} onChangeText={setCombustivel} />
      <FormField label="Status" value={status} onChangeText={setStatus} />
      <FormField label="Notas" value={notas} onChangeText={setNotas} multiline />
      <AppButton title="Atualizar" onPress={() => void submit()} />
    </Screen>
  );
}
