# OptCar Realtime Database

## Nodes
- `veiculos`
- `alugueres`
- `alugueres_terminados`
- `orcamentos`

## Rules
As regras estao em `database.rules.json` e exigem utilizador autenticado (`auth != null`) para leitura/escrita.

## Seed local
1. Definir credenciais de um utilizador com permissao de escrita:
   - `OPTCAR_ADMIN_EMAIL`
   - `OPTCAR_ADMIN_PASSWORD`
2. Executar:

```bash
npm run db:seed
```

Isto escreve o payload de `database.seed.json` na raiz da RTDB.

## Validar regras localmente
```bash
npm run db:rules:check
```
