# Hotfix 1.5.14 — Textos legais V2

Escopo:
- Atualiza o texto de Termos de Uso conforme revisão enviada.
- Atualiza o texto de Política de Privacidade conforme revisão enviada.
- Adiciona botão “Voltar para a página inicial” no final dos Termos de Uso.
- Adiciona botão “Voltar para a página inicial” no final da Política de Privacidade.
- Melhora os nomes das versões gravadas no banco:
  - `termos_uso_v1_2026_09_29`
  - `politica_privacidade_v1_2026_09_29`

Arquivos alterados:
- `lib/legal.ts`
- `app/termos-de-uso/page.tsx`
- `app/politica-de-privacidade/page.tsx`

Observação:
- Não há nova migration.
- Registros antigos em `journey_responses` permanecem com o valor anterior.
- Para validar os novos nomes de versão, gere uma nova aplicação após publicar este hotfix.
