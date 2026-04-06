import { useRouter } from 'expo-router';
import { Header } from '../components/Header';
import { Screen } from '../components/Screen';
import { AppButton } from '../components/ui/AppButton';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Header title="Pagina nao encontrada" />
      <AppButton title="Voltar" onPress={() => router.back()} variant="secondary" />
    </Screen>
  );
}
