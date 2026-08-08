# Patch 1.2.0 — Correção do envio final sem RPC

Este patch corrige o erro ao clicar em **Concluir Avaliação**:

```text
Could not find the function public.submit_public_journey_response_multifractal(...) in the schema cache
```

## O que mudou

A rota de envio deixou de depender da função RPC `submit_public_journey_response_multifractal`.

Agora o endpoint:

```text
app/api/journeys/submit/route.ts
```

salva diretamente nas tabelas:

```text
journey_responses
journey_response_fractals
journeys
```

usando o cliente admin do servidor.

## Por que isso resolve

O erro vinha do cache de schema do Supabase/PostgREST não encontrar a função RPC nova, mesmo após recriação.

Ao remover a dependência da RPC no envio, eliminamos esse ponto de falha.

## Preciso executar SQL?

Não é necessário executar SQL para este patch, desde que a migration principal da 1.2.0 já tenha criado as tabelas:

```text
journey_fractals
journey_response_fractals
```

O arquivo abaixo é apenas uma verificação opcional:

```text
banco/migrations/RELEASE_1_2_0_PATCH_SEM_RPC.sql
```

## Atenção

Este patch usa:

```text
SUPABASE_SERVICE_ROLE_KEY
```

Ela já é usada pelo projeto em outras rotas administrativas. Se no ambiente local aparecer erro de variável ausente, confira se o `.env.local` possui essa chave.
