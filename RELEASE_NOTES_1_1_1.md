# Release 1.1.1 — Empresas

## Objetivo

Concluir a administração de empresas no Lifenergy Digital, permitindo editar os dados da empresa e do administrador sem alterar o schema do banco.

## Escopo entregue

- Cadastro de empresa mantido.
- Listagem com Empresa, Administrador, E-mail, Status e Ações.
- Edição do nome da empresa.
- Edição do nome do administrador.
- Edição do e-mail do administrador.
- Atualização do e-mail também no Supabase Auth.
- Alteração opcional da senha diretamente pelo Super Admin.
- Ativação e inativação mantidas.
- Exclusão não implementada.

## Arquivos alterados

- `app/painel/empresas/page.tsx`
- `services/companies/actions.ts`

## Banco de dados

Nenhuma alteração de schema.

## Checklist de testes

1. Acessar `/painel/empresas` como `super_admin`.
2. Confirmar as cinco colunas da tabela.
3. Cadastrar uma nova empresa.
4. Editar nome da empresa, administrador e e-mail.
5. Confirmar login com o novo e-mail.
6. Confirmar que o e-mail antigo não realiza mais o login.
7. Inativar e reativar a empresa.
8. Executar `npm run build`.

## Publicação

```bash
npm run build
git add .
git commit -m "Release 1.1.1 - Empresas"
git push
```
