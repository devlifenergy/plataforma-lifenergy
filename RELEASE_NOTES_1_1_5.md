# Release 1.1.5 — Correção de build

## Problema corrigido

O JSX da condição que bloqueia a edição de avaliações concluídas estava sem o fechamento `}` após o operador ternário.

## Correção aplicada

- Fechamento correto da expressão JSX:
  - antes: `)`
  - depois: `)}`
- Mantido o bloqueio para status `completed` e `exported`.
- Mantida a validação também na Server Action.

## Arquivos

- `app/painel/entrevistados/page.tsx`
- `services/journeys/actions.ts`

## Validação

```bash
npm run build
```
