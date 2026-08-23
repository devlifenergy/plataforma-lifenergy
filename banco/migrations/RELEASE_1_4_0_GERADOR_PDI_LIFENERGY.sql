-- ============================================================================
-- LIFENERGY DIGITAL — RELEASE 1.4.0
-- Gerador de PDI Lifenergy em DOCX
-- ============================================================================
-- Execute no Supabase Sandbox antes de testar o botão "Gerar PDI".
-- Não remove nem altera a exportação CSV ou o Gerador de Relatório Lifenergy.
-- ============================================================================

create extension if not exists pgcrypto;

create table if not exists public.generated_pdis (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  journey_id uuid not null references public.journeys(id) on delete cascade,
  journey_response_id uuid not null references public.journey_responses(id) on delete cascade,
  source_report_id uuid references public.generated_reports(id) on delete set null,
  pdi_version text not null default 'lifenergy_pdi_v1_0',
  format text not null default 'docx' check (format in ('docx')),
  status text not null default 'generated' check (status in ('generated', 'archived', 'error')),
  generated_by uuid references public.profiles(id) on delete set null,
  model text,
  engine_version text,
  prompt_version text,
  template_version text,
  source_snapshot_json jsonb not null,
  generated_content_json jsonb not null,
  file_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (journey_response_id, pdi_version, format)
);

comment on table public.generated_pdis is
  'PDIs Lifenergy gerados automaticamente. Preserva o snapshot dos dados, o relatório-fonte e o conteúdo do PDI.';

comment on column public.generated_pdis.source_report_id is
  'Relatório Lifenergy usado como referência do PDI, quando já existia no momento da geração.';

comment on column public.generated_pdis.source_snapshot_json is
  'Fotografia dos dados e do conteúdo do relatório usados no momento da geração do PDI.';

comment on column public.generated_pdis.generated_content_json is
  'Conteúdo estruturado gerado para o PDI Lifenergy.';

create index if not exists generated_pdis_organization_id_idx
  on public.generated_pdis(organization_id);

create index if not exists generated_pdis_journey_response_id_idx
  on public.generated_pdis(journey_response_id);

create index if not exists generated_pdis_source_report_id_idx
  on public.generated_pdis(source_report_id);

create index if not exists generated_pdis_created_at_idx
  on public.generated_pdis(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists generated_pdis_set_updated_at on public.generated_pdis;
create trigger generated_pdis_set_updated_at
before update on public.generated_pdis
for each row execute function public.set_updated_at();

alter table public.generated_pdis enable row level security;

drop policy if exists "generated_pdis_select_by_organization" on public.generated_pdis;
drop policy if exists "generated_pdis_insert_by_organization" on public.generated_pdis;
drop policy if exists "generated_pdis_update_by_organization" on public.generated_pdis;

create policy "generated_pdis_select_by_organization"
on public.generated_pdis
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and (
        p.role = 'super_admin'
        or p.organization_id = generated_pdis.organization_id
      )
  )
);

create policy "generated_pdis_insert_by_organization"
on public.generated_pdis
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and (
        p.role = 'super_admin'
        or p.organization_id = generated_pdis.organization_id
      )
  )
);

create policy "generated_pdis_update_by_organization"
on public.generated_pdis
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and (
        p.role = 'super_admin'
        or p.organization_id = generated_pdis.organization_id
      )
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and (
        p.role = 'super_admin'
        or p.organization_id = generated_pdis.organization_id
      )
  )
);

grant select, insert, update on public.generated_pdis to authenticated;

select 'release_1_4_0_gerador_pdi_lifenergy_ok' as status, now() as applied_at;
