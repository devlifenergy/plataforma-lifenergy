# Release 1.2.0 — Patch de envio final sem RPC

## Correção

- Corrigido o erro ao clicar em **Concluir Avaliação** quando o Supabase não encontrava a função `submit_public_journey_response_multifractal` no schema cache.
- O envio final agora grava diretamente nas tabelas via rota de servidor, sem depender de RPC.
- Mantido o fluxo com resumo por fractal e resumo final consolidado.
- Mantida compatibilidade com a estrutura aditiva da 1.2.0.

## Arquivos alterados

- `app/api/journeys/submit/route.ts`
- `components/lifenergy/PublicLifenergyForm.tsx`
- `app/r/[token]/formulario/page.tsx`
- `lib/supabaseAdmin.ts`
- `banco/migrations/RELEASE_1_2_0_PATCH_SEM_RPC.sql`


## Patch — Correção do envio final com organization_id

- Corrigido insert direto em `journey_responses` para preencher `organization_id` a partir da jornada vinculada ao token.
- Não requer nova migration SQL.
- Mantém a abordagem sem RPC no envio final.
