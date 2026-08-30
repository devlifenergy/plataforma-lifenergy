-- ============================================================================
-- LIFENERGY DIGITAL — RELEASE 1.5.6
-- Motor Métrico Canônico, autocalibração, Biblioteca separada e pré-cadastro
-- ============================================================================

-- 1) Campos do convite para pré-preencher o Passo 3 do formulário público.
alter table public.journeys
  add column if not exists participant_cpf text,
  add column if not exists participant_naturalidade text,
  add column if not exists participant_birth_date date,
  add column if not exists participant_objective text;

comment on column public.journeys.participant_cpf is 'CPF informado na criação do convite para pré-preencher o formulário público.';
comment on column public.journeys.participant_naturalidade is 'Naturalidade informada na criação do convite para pré-preencher o formulário público.';
comment on column public.journeys.participant_birth_date is 'Data de nascimento informada na criação do convite para pré-preencher o formulário público.';
comment on column public.journeys.participant_objective is 'Objetivo de participação informado na criação do convite para pré-preencher o formulário público.';

-- 2) Tabela de autocalibração do Item 6 do Relatório Lifenergy V1.
create table if not exists public.lifenergy_metric_calibrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid null references public.organizations(id) on delete cascade,
  journey_response_id uuid null references public.journey_responses(id) on delete cascade,
  response_signature text not null,
  report_version text not null,
  metric_engine_version text not null,
  attributes_json jsonb not null,
  evidence_json jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lifenergy_metric_calibrations_status_check check (status in ('active', 'archived'))
);

create unique index if not exists lifenergy_metric_calibrations_response_unique
  on public.lifenergy_metric_calibrations(journey_response_id)
  where journey_response_id is not null;

create index if not exists lifenergy_metric_calibrations_signature_idx
  on public.lifenergy_metric_calibrations(response_signature)
  where status = 'active';

comment on table public.lifenergy_metric_calibrations is
  'Casos gerados pelo modelo canônico para autocalibração do Item 6 do Relatório Lifenergy V1.';

-- 3) Atualização da função pública de contexto para devolver dados de identificação do convite.
-- IMPORTANTE:
-- O tipo de retorno desta função mudou nesta release. No PostgreSQL, quando os OUT
-- parameters mudam, CREATE OR REPLACE FUNCTION não consegue alterar o tipo de retorno.
-- Por isso, removemos a assinatura antiga antes de recriar a função.
drop function if exists public.get_public_journey_context_v2_by_token(text);

create function public.get_public_journey_context_v2_by_token(p_token text)
returns table (
  activity text,
  applicator_name text,
  participant_name text,
  participant_email text,
  participant_cpf text,
  participant_naturalidade text,
  participant_birth_date date,
  participant_objective text,
  fractals jsonb
)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(nullif(trim(j.activity), ''), '') as activity,
    coalesce(a.name, '') as applicator_name,
    coalesce(j.participant_name, '') as participant_name,
    coalesce(j.participant_email, '') as participant_email,
    coalesce(j.participant_cpf, '') as participant_cpf,
    coalesce(j.participant_naturalidade, '') as participant_naturalidade,
    j.participant_birth_date,
    coalesce(j.participant_objective, '') as participant_objective,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', jf.id,
          'position', jf.position,
          'activity', jf.activity
        )
        order by jf.position
      ) filter (where jf.id is not null),
      jsonb_build_array(
        jsonb_build_object(
          'id', null,
          'position', 1,
          'activity', coalesce(nullif(trim(j.activity), ''), 'Fractal de Comportamento')
        )
      )
    ) as fractals
  from public.journeys j
  left join public.applicators a on a.id = j.applicator_id
  left join public.journey_fractals jf on jf.journey_id = j.id
  where j.token = p_token
  group by j.id, j.activity, a.name, j.participant_name, j.participant_email,
    j.participant_cpf, j.participant_naturalidade, j.participant_birth_date, j.participant_objective;
$$;

grant execute on function public.get_public_journey_context_v2_by_token(text)
  to anon, authenticated;

select 'release_1_5_6_ok' as status, now() as applied_at;
