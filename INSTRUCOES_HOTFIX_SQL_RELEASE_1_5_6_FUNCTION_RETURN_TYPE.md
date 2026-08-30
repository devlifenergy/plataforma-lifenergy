# Hotfix SQL — Release 1.5.6

## Erro corrigido

Ao executar o SQL da Release 1.5.6, o Supabase retornou:

```text
ERROR: 42P13: cannot change return type of existing function
DETAIL: Row type defined by OUT parameters is different.
HINT: Use DROP FUNCTION get_public_journey_context_v2_by_token(text) first.
```

## Causa

A função:

```text
public.get_public_journey_context_v2_by_token(text)
```

já existia no banco com um tipo de retorno diferente.

Como a Release 1.5.6 adiciona novos campos ao retorno da função, o PostgreSQL não permite alterar esse retorno apenas com `create or replace function`.

## Correção aplicada

O SQL agora executa antes:

```sql
drop function if exists public.get_public_journey_context_v2_by_token(text);
```

E depois recria a função com o novo retorno.

## O que fazer

Execute novamente no Supabase Sandbox o SQL corrigido:

```text
banco/migrations/RELEASE_1_5_6_MOTOR_METRICO_FORMULARIO_BIBLIOTECA.sql
```

Pode executar novamente. As etapas anteriores usam `if not exists` e não devem duplicar colunas ou tabelas.

## Depois do SQL

Rode no projeto:

```powershell
rmdir /s /q .next
npm run build
```

Se passar:

```powershell
git add .
git commit -m "Release 1.5.6 - Motor metrico canonico e ajustes do formulario"
git push origin feature/multiplos-fractais-prototipo
```
