import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { AppButton } from '../components/ui/AppButton';
import { FormField } from '../components/ui/FormField';
import { InlineMessage } from '../components/ui/InlineMessage';
import { LinkButton } from '../components/ui/LinkButton';
import { useAuth } from '../hooks/useAuth';
import { useAppTheme } from '../hooks/useAppTheme';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { theme } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email || !password) {
      setError('Preencha email e palavra-passe.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View
        style={{
          marginTop: 8,
          borderRadius: 24,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.primaryDark,
          padding: 18,
          gap: 8,
        }}
      >
        <Text style={{ color: theme.colors.textOnPrimary, fontSize: 28, fontWeight: '800' }}>OptCar</Text>
        <Text style={{ color: theme.colors.textOnPrimary, opacity: 0.9, lineHeight: 20 }}>
          Plataforma de gestao para rent-a-car com contratos, frota e rececao em tempo real.
        </Text>
      </View>

      <Card style={{ marginTop: 6, gap: 12 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ color: theme.colors.textPrimary, fontSize: 22, fontWeight: '800' }}>Entrar</Text>
          <Text style={{ color: theme.colors.textSecondary }}>Acede ao painel operacional.</Text>
        </View>

        <FormField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="email@dominio.com" />
        <FormField label="Palavra-passe" value={password} onChangeText={setPassword} secureTextEntry placeholder="******" />
        {error ? <InlineMessage type="error" message={error} /> : null}

        <AppButton title={loading ? 'A entrar...' : 'Entrar na plataforma'} onPress={() => void onSubmit()} disabled={loading} />

        <View style={{ paddingTop: 2 }}>
          <LinkButton label="Ainda nao tens conta? Criar conta" onPress={() => router.push('/register')} />
        </View>
      </Card>
    </Screen>
  );
}
