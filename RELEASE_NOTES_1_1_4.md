# Release 1.1.4 — Avaliados

## Objetivo

Aplicar ao módulo Avaliados o padrão administrativo definido nas releases anteriores, sem alterar o fluxo público da avaliação.

## Escopo entregue

- O endereço interno permanece `/painel/entrevistados`.
- O serviço permanece em `services/journeys`.
- Título visual alterado de `Entrevistados` para `Avaliados`.
- Textos da interface atualizados para `avaliado`.
- Contador com singular e plural corretos.
- Listagem com:
  - Código
  - Avaliado
  - E-mail
  - Aplicador
  - Status
  - Ações
- Status exibido com selo visual.
- Ação `Abrir link` preservada.
- Edição do nome e e-mail do avaliado.
- Validação de que o aplicador selecionado pertence à empresa e está ativo.
- Isolamento dos registros por `organization_id`.
- Sem exclusão.
- Sem alteração no banco de dados.
- Sem alteração no envio do formulário público.

## Arquivos alterados

- `app/painel/entrevistados/page.tsx`
- `services/journeys/actions.ts`

## Arquivo preservado

- `services/journeys/submitJourney.ts`

## Checklist

1. Executar `npm run build`.
2. Acessar `/painel/entrevistados`.
3. Confirmar o título `Avaliados`.
4. Criar convite para um novo avaliado.
5. Confirmar a exibição do e-mail na tabela.
6. Editar nome e e-mail.
7. Abrir o link público.
8. Concluir uma avaliação de teste.
9. Confirmar a atualização visual do status.
10. Confirmar que registros de outra empresa não são acessíveis.
11. Confirmar que aplicadores inativos não aparecem no cadastro.
12. Confirmar que `submitJourney.ts` continua funcionando sem alterações.

## Publicação

```bash
npm run build
git add .
git commit -m "Release 1.1.4 - Avaliados"
git push
```
