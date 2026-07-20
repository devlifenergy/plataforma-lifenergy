# Release 1.1.2 — Login Revisada

## Ajustes implementados

- Remoção completa do ícone “L”.
- Destaque principal para `LIFENERGY DIGITAL`.
- Fonte maior, peso forte e menor espaçamento entre letras.
- Manutenção da cor institucional atual.
- Texto secundário: `Acesse o portal da sua empresa.`
- Redução da altura dos campos e do botão.
- Texto do botão alterado para `Entrar no Portal`.
- Identificação automática da empresa após o preenchimento do e-mail.
- Exibição discreta do nome da empresa antes do campo de senha.
- Login mantido em uma única etapa.
- Validação de empresa inativa mantida.
- Nenhuma alteração no schema do banco.

## Arquivos

- `app/login/page.tsx`
- `app/login/LoginForm.tsx`
- `services/auth/actions.ts`

## Checklist

1. Executar `npm run build`.
2. Abrir `/login`.
3. Confirmar que o ícone “L” não aparece.
4. Confirmar que `LIFENERGY DIGITAL` é o elemento principal.
5. Digitar um e-mail de administrador cadastrado.
6. Confirmar que o nome da empresa aparece automaticamente.
7. Testar o login correto.
8. Testar senha incorreta.
9. Testar empresa inativa.
10. Testar login do `super_admin`.
