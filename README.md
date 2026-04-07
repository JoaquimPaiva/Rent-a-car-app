# OptCar Mobile

Aplicacao mobile para gestao operacional de rent-a-car, feita com Expo + React Native + TypeScript, com autenticacao Firebase e dados em tempo real via Realtime Database.

## Visao Geral

O projeto foi pensado para centralizar a operacao diaria de uma empresa de aluguer automovel:

- Login, registo e logout de utilizadores.
- Gestao de veiculos (CRUD).
- Gestao de contratos (criacao, edicao, detalhe e rececao/finalizacao).
- Gestao de orcamentos, com detalhe completo.
- Dashboard com KPIs operacionais.
- Sincronizacao realtime com Firebase.
- Tema claro/escuro com persistencia local.
- Navegacao por tabs, incluindo `unstable-native-tabs` no iOS.

![Descrição da imagem](./exemple.jpg)

## Principais Funcionalidades

### Autenticacao
- `login` e `register` com Firebase Auth.
- Persistencia de sessao em React Native com AsyncStorage.
- Guard de rotas no layout raiz:
  - sem sessao -> redireciona para `/login`
  - com sessao em rotas de auth -> redireciona para `/veiculos`

### Veiculos
- Listagem em tempo real.
- Criacao e edicao em form sheet.
- Tela de detalhes.

### Contratos
- Listagem de alugueres ativos.
- Criacao e edicao.
- Tela de detalhe.
- Rececao/finalizacao de contrato (move para `alugueres_terminados`).

### Orcamentos
- Listagem com resumo.
- Cards clicaveis para detalhe.
- Tela de detalhe com dados de cliente, periodo, valores e observacoes.

### Dashboard
- KPIs:
  - total de veiculos
  - contratos abertos
  - contratos finalizados
  - total de orcamentos
- Acoes rapidas para fluxos principais.
- Estado de sincronizacao realtime.

### Tema
- Modo claro e escuro.
- Persistencia de preferencia em `AsyncStorage` (`optcar.theme.mode`).

## Stack Tecnica

- `expo ~54.0.33`
- `react 19.1.0`
- `react-native 0.81.5`
- `expo-router ~6.0.23`
- `firebase ^12.11.0`
- `nativewind ^4.2.3`
- `tailwindcss ^3.4.19`
- `@react-native-async-storage/async-storage ^2.2.0`
- `react-native-reanimated ~4.1.1`
- `react-native-worklets 0.5.1`
- `typescript ~5.9.2`

## Estrutura de Pastas

```txt
app/
  _layout.tsx
  index.tsx
  login.tsx
  register.tsx
  modal.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    veiculos.tsx
    contratos.tsx
    orcamentos.tsx
    finalizados.tsx
  veiculos/
    novo.tsx
    editar/[id].tsx
    detalhes/[id].tsx
  contratos/
    novo.tsx
    editar/[id].tsx
    detalhes/[id].tsx
    rececao.tsx
  orcamentos/
    detalhes/[id].tsx

components/
hooks/
lib/
scripts/
docs/
```

## Firebase

Configuracao atual em [`lib/firebase.ts`](./lib/firebase.ts):

- `Auth`: login/registo/logout + persistencia.
- `Realtime Database`: leitura/escrita/subscribe em tempo real.

### Nos usados na RTDB

- `veiculos`
- `alugueres`
- `alugueres_terminados`
- `orcamentos`

### Regras

As regras ficam em [`database.rules.json`](./database.rules.json) e exigem autenticacao:

- leitura: `auth != null`
- escrita: `auth != null`

## Scripts NPM

```bash
npm run start         # Expo dev server
npm run android       # Run Android (native)
npm run ios           # Run iOS (native)
npm run web           # Run web
npm run typecheck     # TypeScript check
npm run db:seed       # Seed da Realtime Database
npm run db:rules:check
```

## Como Executar Localmente

### 1) Pre-requisitos
- Node.js 18+ (recomendado)
- npm
- Android Studio e/ou Xcode (para builds nativas)
- Conta Firebase com acesso ao projeto

### 2) Instalar dependencias

```bash
npm install
```

### 3) Arrancar projeto

```bash
npm run start
```

Opcional:

```bash
npm run android
npm run ios
```

## Seed da Base de Dados

Para escrever o payload de `database.seed.json` na RTDB:

1. Definir variaveis de ambiente:

```bash
export OPTCAR_ADMIN_EMAIL="teu-email"
export OPTCAR_ADMIN_PASSWORD="tua-password"
```

2. Executar:

```bash
npm run db:seed
```

## Notas Tecnicas Importantes

### Patch do Expo Router no postinstall

Existe um script [`scripts/fix-expo-router-ctx.js`](./scripts/fix-expo-router-ctx.js) executado no `postinstall` para corrigir o erro de bundling relacionado com `_ctx` e `EXPO_ROUTER_IMPORT_MODE`.

### Navegacao por plataforma

- iOS: `expo-router/unstable-native-tabs`
- Android/Web: `Tabs` classicas com `Ionicons`

## Qualidade e Manutencao

- Projeto tipado com TypeScript.
- `npm run typecheck` para validacao estatica.
- Mapeamento de payloads RTDB com normalizacao e fallbacks em [`lib/realtime.ts`](./lib/realtime.ts).
- Mensagens de erro de auth traduzidas e amigaveis em [`lib/auth.ts`](./lib/auth.ts).

## Roadmap (Sugestoes)

- Filtros e pesquisa avancada em listas.
- Exportacao de contratos/orcamentos (PDF/CSV).
- Permissoes por perfil (admin, operador, leitura).
- Testes automatizados (unitarios e E2E).
- CI/CD para build e distribuicao.

## Estado do Projeto

Projeto funcional e em evolucao, com foco em consolidar UX, regras de negocio e robustez da camada de dados.

