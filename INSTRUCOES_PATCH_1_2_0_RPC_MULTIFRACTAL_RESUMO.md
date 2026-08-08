# Patch 1.2.0 — Correção de envio, tempo e resumos por fractal

Este patch corrige dois pontos pendentes na branch 1.2.0:

1. O erro no envio final: `column "initial_time" is of type time without time zone but expression is of type text`.
2. A apresentação do quadro de resumo ao final de cada fractal antes de avançar.

## Como aplicar

1. Aplique este ZIP por cima da branch `feature/multiplos-fractais-prototipo`.
2. No Supabase SQL Editor, execute apenas o arquivo:

```text
banco/migrations/RELEASE_1_2_0_PATCH_RPC_MULTIFRACTAL_RESUMO.sql
```

3. Rode:

```powershell
npm run build
npm run dev
```

## Observação importante

A rota de envio passa a chamar a função nova:

```text
submit_public_journey_response_multifractal
```

Isso evita conflito com funções antigas `v2` já criadas durante os testes.
