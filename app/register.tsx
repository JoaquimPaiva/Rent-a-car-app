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

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { theme } = useAppTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name || !email || !password) {
      setError('Preencha nome, email e palavra-passe.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signUp(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no registo.');
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
          backgroundColor: theme.colors.accent,
          padding: 18,
          gap: 8,
        }}
      >
        <Text style={{ color: theme.colors.textOnPrimary, fontSize: 28, fontWeight: '800' }}>Criar Conta</Text>
        <Text style={{ color: theme.colors.textOnPrimary, opacity: 0.92, lineHeight: 20 }}>
          Junta-te ao OptCar e gere frota, contratos e rececao num unico fluxo.
        </Text>
      </View>

      <Card style={{ marginTop: 6, gap: 12 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ color: theme.colors.textPrimary, fontSize: 22, fontWeight: '800' }}>Novo utilizador</Text>
          <Text style={{ color: theme.colors.textSecondary }}>Preenche os dados para finalizar o registo.</Text>
        </View>

        <FormField label="Nome" value={name} onChangeText={setName} placeholder="Nome completo" />
        <FormField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="email@dominio.com" />
        <FormField label="Palavra-passe" value={password} onChangeText={setPassword} secureTextEntry placeholder="Minimo 6 caracteres" />
        {error ? <InlineMessage type="error" message={error} /> : null}

        <AppButton title={loading ? 'A criar conta...' : 'Criar conta'} onPress={() => void onSubmit()} disabled={loading} />

        <View style={{ paddingTop: 2 }}>
          <LinkButton label="Ja tens conta? Entrar" onPress={() => router.push('/login')} />
        </View>
      </Card>
    </Screen>
  );
}
