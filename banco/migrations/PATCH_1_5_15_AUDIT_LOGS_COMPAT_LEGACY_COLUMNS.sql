-- Patch 1.5.15.1 - Compatibilidade da auditoria com colunas legadas.
-- Seguro para rodar mais de uma vez.
-- Objetivo: evitar falhas silenciosas de insert em audit_logs quando a tabela
-- foi criada por versões anteriores com colunas user_id/entity.

alter table if exists public.audit_logs
  add column if not exists user_id uuid,
  add column if not exists entity text;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'audit_logs'
      and column_name = 'user_id'
  ) then
    alter table public.audit_logs alter column user_id drop not null;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'audit_logs'
      and column_name = 'entity'
  ) then
    alter table public.audit_logs alter column entity drop not null;
  end if;
end $$;

update public.audit_logs
set entity = coalesce(entity, entity_type, action)
where entity is null;

update public.audit_logs
set user_id = actor_user_id
where user_id is null
  and actor_user_id is not null;

create index if not exists audit_logs_user_id_idx
  on public.audit_logs (user_id);

create index if not exists audit_logs_legacy_entity_idx
  on public.audit_logs (entity);
