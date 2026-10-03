-- Patch 1.5.15 - Garante todas as colunas usadas pela tela de Auditoria.
-- Seguro para rodar mais de uma vez: usa add column if not exists.

alter table if exists public.audit_logs
  add column if not exists organization_name text,
  add column if not exists actor_profile_id uuid,
  add column if not exists actor_user_id uuid,
  add column if not exists actor_name text,
  add column if not exists actor_email text,
  add column if not exists entity_type text,
  add column if not exists entity_id text,
  add column if not exists description text,
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists ip_address text,
  add column if not exists user_agent text;

create index if not exists audit_logs_actor_profile_id_idx
  on public.audit_logs (actor_profile_id);

create index if not exists audit_logs_actor_email_idx
  on public.audit_logs (actor_email);

create index if not exists audit_logs_entity_type_idx
  on public.audit_logs (entity_type);

comment on column public.audit_logs.organization_name
  is 'Nome da organização no momento do evento de auditoria, usado para exibição e histórico.';

comment on column public.audit_logs.actor_name
  is 'Nome do usuário responsável pelo evento, quando disponível.';

comment on column public.audit_logs.actor_email
  is 'E-mail do usuário responsável pelo evento, quando disponível.';
