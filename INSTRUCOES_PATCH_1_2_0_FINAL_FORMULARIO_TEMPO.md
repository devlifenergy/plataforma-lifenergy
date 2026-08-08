# Patch 1.2.0 — Formulário, resumo por fractal e conversão de hora

Este patch corrige três pontos da Release 1.2.0:

1. Ao avançar/voltar, o formulário retorna para o início do card.
2. Após cada fractal, aparece um quadro resumo daquele fractal antes de avançar para o próximo.
3. Corrige definitivamente a gravação do campo `initial_time`, recriando apenas a função `submit_public_journey_response_v2`.

## Como aplicar

1. Extraia o ZIP por cima da branch `feature/multiplos-fractais-prototipo`.
2. No Supabase SQL Editor, execute o arquivo:

```text
banco/migrations/RELEASE_1_2_0_PATCH_FINAL_FORMULARIO_TEMPO.sql
```

3. Rode localmente:

```powershell
npm run build
npm run dev
```

## Observação de segurança

Este patch não altera a função antiga da versão 1.1.10. Ele remove e recria somente a função `submit_public_journey_response_v2`, usada pela Release 1.2.0.
