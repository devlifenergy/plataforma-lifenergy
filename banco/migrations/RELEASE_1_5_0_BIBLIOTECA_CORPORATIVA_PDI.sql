-- ============================================================================
-- LIFENERGY DIGITAL — RELEASE 1.5.0
-- Tela de PDI + Biblioteca Corporativa Inteligente
-- ============================================================================
-- Execute no Supabase Sandbox antes de publicar/testar a versão 1.5.0.
-- Esta release cria documentos corporativos da empresa e contexto operacional
-- do PDI. Não exige Termo ou Política de uso do PDI.
-- ============================================================================

create extension if not exists pgcrypto;

create table if not exists public.organization_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  category text not null check (category in (
    'culture_values',
    'competencies_matrix',
    'jobs_roles',
    'strategy_priorities',
    'learning_tracks',
    'performance_model',
    'management_rituals',
    'other'
  )),
  title text not null,
  file_name text,
  mime_type text,
  file_size integer,
  content_text text not null default '',
  status text not null default 'active' check (status in ('active', 'archived')),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.organization_documents is
  'Documentos da empresa usados pela Biblioteca Corporativa Inteligente para geração de PDI Corporativo.';

comment on column public.organization_documents.content_text is
  'Sumário técnico interno gerado pela IA a partir do documento carregado. Não deve ser exibido ao usuário da empresa.';

create index if not exists organization_documents_organization_id_idx
  on public.organization_documents(organization_id);

create index if not exists organization_documents_category_idx
  on public.organization_documents(organization_id, category)
  where status = 'active';

create table if not exists public.pdi_contexts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  journey_response_id uuid not null references public.journey_responses(id) on delete cascade,
  pdi_type text not null default 'relational' check (pdi_type in ('relational', 'corporate')),
  person_type text not null default 'external' check (person_type in ('external', 'employee')),
  current_job_title text,
  current_area text,
  manager_name text,
  context_summary text,
  current_situation text,
  current_challenges text,
  development_priorities text,
  career_direction text,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (journey_response_id)
);

comment on table public.pdi_contexts is
  'Contexto operacional do PDI. Não é documento obrigatório da Biblioteca Corporativa.';

create index if not exists pdi_contexts_organization_id_idx
  on public.pdi_contexts(organization_id);

create index if not exists pdi_contexts_journey_response_id_idx
  on public.pdi_contexts(journey_response_id);

alter table public.generated_pdis
  add column if not exists pdi_type text not null default 'relational' check (pdi_type in ('relational', 'corporate'));

-- A versão 1.5.0 permite PDI Relacional e PDI Corporativo para a mesma resposta.
do $$
begin
  alter table public.generated_pdis
    drop constraint if exists generated_pdis_journey_response_id_pdi_version_format_key;
exception when others then
  null;
end $$;

do $$
begin
  alter table public.generated_pdis
    add constraint generated_pdis_journey_response_pdi_type_version_format_key
    unique (journey_response_id, pdi_version, format, pdi_type);
exception when duplicate_object then
  null;
end $$;

create index if not exists generated_pdis_pdi_type_idx
  on public.generated_pdis(pdi_type);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists organization_documents_set_updated_at on public.organization_documents;
create trigger organization_documents_set_updated_at
before update on public.organization_documents
for each row execute function public.set_updated_at();

drop trigger if exists pdi_contexts_set_updated_at on public.pdi_contexts;
create trigger pdi_contexts_set_updated_at
before update on public.pdi_contexts
for each row execute function public.set_updated_at();

alter table public.organization_documents enable row level security;
alter table public.pdi_contexts enable row level security;

drop policy if exists "organization_documents_select_by_organization" on public.organization_documents;
drop policy if exists "organization_documents_insert_by_organization" on public.organization_documents;
drop policy if exists "organization_documents_update_by_organization" on public.organization_documents;

create policy "organization_documents_select_by_organization"
on public.organization_documents
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.auth_user_id = auth.uid()
      and (p.role = 'super_admin' or p.organization_id = organization_documents.organization_id)
  )
);

create policy "organization_documents_insert_by_organization"
on public.organization_documents
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles p
    where p.auth_user_id = auth.uid()
      and (p.role = 'super_admin' or p.organization_id = organization_documents.organization_id)
  )
);

create policy "organization_documents_update_by_organization"
on public.organization_documents
for update
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.auth_user_id = auth.uid()
      and (p.role = 'super_admin' or p.organization_id = organization_documents.organization_id)
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.auth_user_id = auth.uid()
      and (p.role = 'super_admin' or p.organization_id = organization_documents.organization_id)
  )
);

drop policy if exists "pdi_contexts_select_by_organization" on public.pdi_contexts;
drop policy if exists "pdi_contexts_insert_by_organization" on public.pdi_contexts;
drop policy if exists "pdi_contexts_update_by_organization" on public.pdi_contexts;

create policy "pdi_contexts_select_by_organization"
on public.pdi_contexts
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.auth_user_id = auth.uid()
      and (p.role = 'super_admin' or p.organization_id = pdi_contexts.organization_id)
  )
);

create policy "pdi_contexts_insert_by_organization"
on public.pdi_contexts
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles p
    where p.auth_user_id = auth.uid()
      and (p.role = 'super_admin' or p.organization_id = pdi_contexts.organization_id)
  )
);

create policy "pdi_contexts_update_by_organization"
on public.pdi_contexts
for update
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.auth_user_id = auth.uid()
      and (p.role = 'super_admin' or p.organization_id = pdi_contexts.organization_id)
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.auth_user_id = auth.uid()
      and (p.role = 'super_admin' or p.organization_id = pdi_contexts.organization_id)
  )
);

grant select, insert, update on public.organization_documents to authenticated;
grant select, insert, update on public.pdi_contexts to authenticated;

select 'release_1_5_0_biblioteca_corporativa_pdi_ok' as status, now() as applied_at;
