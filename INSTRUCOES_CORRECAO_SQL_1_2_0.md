# Correção SQL — Release 1.2.0

O erro `cannot change return type of existing function` ocorreu porque PostgreSQL não permite alterar o tipo de retorno de uma função existente usando `CREATE OR REPLACE FUNCTION`.

Esta correção preserva a função antiga `get_public_journey_context_by_token(text)` e cria uma nova função para a versão 1.2.0:

```sql
get_public_journey_context_v2_by_token(text)
```

## Como aplicar

1. Substitua os arquivos do projeto pelos arquivos deste pacote.
2. No Supabase SQL Editor, execute novamente o conteúdo completo de:

```text
banco/migrations/RELEASE_1_2_0_MULTIPLOS_FRACTAIS.sql
```

3. Depois rode:

```powershell
npm run build
npm run dev
```

A migration é aditiva e idempotente para tabelas já criadas parcialmente.
