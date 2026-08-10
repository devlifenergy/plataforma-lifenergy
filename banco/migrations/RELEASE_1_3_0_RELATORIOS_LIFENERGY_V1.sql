-- ==========================================================================
-- LIFENERGY DIGITAL — RELEASE 1.3.0
-- Gerador de Relatório Lifenergy V1.0 em DOCX
-- ===========================================================================
-- Execute no Supabase Sandbox antes de testar o botão "Gerar Relatório DOCX".
-- Não remove nem altera a exportação CSV existente.
-- ===========================================================================

create extension if not exists pgcrypto;

create table if not exists public.generated_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  journey_id uuid not null references public.journeys(id) on delete cascade,
  journey_response_id uuid not null references public.journey_responses(id) on delete cascade,
  report_version text not null default 'lifenergy_v1_0',
  format text not null default 'docx' check (format in ('docx')),
  status text not null default 'generated' check (status in ('generated', 'archived', 'error')),
  generated_by uuid references public.profiles(id) on delete set null,
  model text,
  source_snapshot_json jsonb not null,
  generated_content_json jsonb not null,
  file_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (journey_response_id, report_version, format)
);

comment on table public.generated_reports is
  'Relatórios Lifenergy gerados automaticamente. Preserva o snapshot dos dados e o conteúdo interpretativo gerado.';

comment on column public.generated_reports.source_snapshot_json is
  'Fotografia dos dados do avaliado usada no momento da geração do relatório.';

comment on column public.generated_reports.generated_content_json is
  'Conteúdo interpretativo gerado para o Relatório Lifenergy V1.0.';

create index if not exists generated_reports_organization_id_idx
  on public.generated_reports(organization_id);

create index if not exists generated_reports_journey_response_id_idx
  on public.generated_reports(journey_response_id);

create index if not exists generated_reports_created_at_idx
  on public.generated_reports(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists generated_reports_set_updated_at on public.generated_reports;
create trigger generated_reports_set_updated_at
before update on public.generated_reports
for each row execute function public.set_updated_at();

alter table public.generated_reports enable row level security;

drop policy if exists "generated_reports_select_by_organization" on public.generated_reports;
drop policy if exists "generated_reports_insert_by_organization" on public.generated_reports;
drop policy if exists "generated_reports_update_by_organization" on public.generated_reports;

create policy "generated_reports_select_by_organization"
on public.generated_reports
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and (
        p.role = 'super_admin'
        or p.organization_id = generated_reports.organization_id
      )
  )
);

create policy "generated_reports_insert_by_organization"
on public.generated_reports
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and (
        p.role = 'super_admin'
        or p.organization_id = generated_reports.organization_id
      )
  )
);

create policy "generated_reports_update_by_organization"
on public.generated_reports
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.auth_user_id = auth.uid()
      and (
        p.role = 'super_admin'
        or p.organization_id = generated_reports.organization_id
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
        or p.organization_id = generated_reports.organization_id
      )
  )
);

grant select, insert, update on public.generated_reports to authenticated;

select 'release_1_3_0_relatorios_lifenergy_v1_ok' as status, now() as applied_at;
