# Patch 1.2.0 — Correção da RPC multifractal e schema cache

## Problema corrigido

Ao clicar em **Concluir Avaliação**, o Supabase retornava:

```json
{"error":"Could not find the function public.submit_public_journey_response_multifractal(...) in the schema cache"}
```

Isso indica que a API/RPC do Supabase não encontrou a assinatura da função no schema cache.

## Como aplicar

1. Extraia este ZIP por cima da branch da 1.2.0.
2. No Supabase SQL Editor, execute o arquivo:

```text
banco/migrations/RELEASE_1_2_0_PATCH_RPC_SCHEMA_CACHE.sql
```

3. Confira se o resultado final mostra uma linha com:

```text
submit_public_journey_response_multifractal
```

4. Aguarde 15 a 30 segundos para o schema cache recarregar.
5. Rode localmente:

```powershell
npm run build
npm run dev
```

6. Crie um novo link de teste e responda até o final.

## Observação importante

Este patch não altera a função antiga da versão 1.1.10. Ele recria apenas a função nova da 1.2.0.
