import { Text } from 'react-native';
import { Header } from '../components/Header';
import { Screen } from '../components/Screen';

export default function ModalScreen() {
  return (
    <Screen>
      <Header title="Modal" subtitle="Area reservada para mensagens futuras" />
      <Text>Modal de suporte da app OptCar.</Text>
    </Screen>
  );
}
