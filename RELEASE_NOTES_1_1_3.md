# Release 1.1.3 — Aplicadores

## Objetivo

Concluir a administração de aplicadores no Lifenergy Digital, mantendo o isolamento por empresa e o padrão visual dos módulos administrativos.

## Escopo entregue

- Título alterado para `Cadastro de Aplicadores`.
- Cadastro de aplicadores mantido.
- Contador com singular e plural corretos.
- Listagem com:
  - Nome
  - E-mail
  - Telefone
  - Status
  - Ações
- Edição de:
  - Nome
  - E-mail
  - Telefone
- Ativação e inativação.
- Selo visual de status.
- Sem exclusão.
- Sem alteração no banco de dados.

## Segurança

Todas as operações validam o `organization_id` do usuário autenticado. Um administrador não consegue editar ou alterar o status de um aplicador pertencente a outra empresa.

## Arquivos alterados

- `app/painel/aplicadores/page.tsx`
- `services/applicators/actions.ts`

## Checklist

1. Executar `npm run build`.
2. Acessar `/painel/aplicadores`.
3. Confirmar o título `Cadastro de Aplicadores`.
4. Cadastrar um novo aplicador.
5. Editar nome, e-mail e telefone.
6. Inativar o aplicador.
7. Reativar o aplicador.
8. Confirmar o singular para um cadastro.
9. Confirmar o plural para dois ou mais cadastros.
10. Confirmar que um usuário de outra empresa não acessa os registros.

## Publicação

```bash
npm run build
git add .
git commit -m "Release 1.1.3 - Aplicadores"
git push
```
