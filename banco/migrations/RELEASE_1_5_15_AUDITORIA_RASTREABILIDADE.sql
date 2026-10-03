-- Release 1.5.15 - Auditoria e Rastreabilidade

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  organization_name text,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  actor_user_id uuid,
  actor_name text,
  actor_email text,
  action text not null,
  entity_type text,
  entity_id text,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_organization_id_idx
  on public.audit_logs (organization_id);

create index if not exists audit_logs_actor_profile_id_idx
  on public.audit_logs (actor_profile_id);

create index if not exists audit_logs_action_idx
  on public.audit_logs (action);

create index if not exists audit_logs_entity_idx
  on public.audit_logs (entity_type, entity_id);

create index if not exists audit_logs_created_at_idx
  on public.audit_logs (created_at desc);

alter table public.audit_logs enable row level security;

drop policy if exists audit_logs_select_by_profile_scope on public.audit_logs;
create policy audit_logs_select_by_profile_scope
on public.audit_logs
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and (
        p.role = 'super_admin'
        or p.organization_id = audit_logs.organization_id
      )
  )
);

drop policy if exists audit_logs_insert_by_authenticated_profile on public.audit_logs;
create policy audit_logs_insert_by_authenticated_profile
on public.audit_logs
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and (
        p.role = 'super_admin'
        or p.organization_id = audit_logs.organization_id
      )
  )
);

comment on table public.audit_logs is 'Trilha de auditoria do Lifenergy Digital para ações críticas do sistema.';
comment on column public.audit_logs.action is 'Código técnico da ação auditada, como journey.created ou report.relational_generated.';
comment on column public.audit_logs.metadata is 'Detalhes complementares do evento em formato JSONB.';
