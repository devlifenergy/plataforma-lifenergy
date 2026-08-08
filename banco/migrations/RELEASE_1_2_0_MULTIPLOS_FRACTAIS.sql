-- Release 1.2.0 — Múltiplos Fractais por Link
-- Migration aditiva e compatível com a versão 1.1.10.
-- Regras:
-- 1. Não remove nem renomeia tabelas/colunas existentes.
-- 2. Preserva registros antigos como Fractal 1 de 1.
-- 3. Permite links novos com 1, 2 ou 3 fractais.

create extension if not exists pgcrypto;

-- 1) Fractais vinculados ao link/jornada.
create table if not exists public.journey_fractals (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  position integer not null check (position between 1 and 3),
  activity text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (journey_id, position)
);

comment on table public.journey_fractals is
  'Fractais de comportamento configurados no link. Cada jornada pode ter de 1 a 3 fractais.';

comment on column public.journey_fractals.position is
  'Ordem do fractal no link: 1, 2 ou 3.';

comment on column public.journey_fractals.activity is
  'Atividade/fractal apresentado ao avaliado para cópia manual e resposta.';

-- 2) Respostas por fractal, vinculadas ao registro principal em journey_responses.
create table if not exists public.journey_response_fractals (
  id uuid primary key default gen_random_uuid(),
  journey_response_id uuid not null references public.journey_responses(id) on delete cascade,
  journey_fractal_id uuid references public.journey_fractals(id) on delete set null,
  position integer not null check (position between 1 and 3),
  presented_activity text not null,
  copied_activity text not null,
  response_1 text not null,
  hierarchy_1 integer not null check (hierarchy_1 in (1, 2, 3)),
  justification_1 text not null,
  response_2 text not null,
  hierarchy_2 integer not null check (hierarchy_2 in (1, 2, 3)),
  justification_2 text not null,
  response_3 text not null,
  hierarchy_3 integer not null check (hierarchy_3 in (1, 2, 3)),
  justification_3 text not null,
  final_feeling text not null,
  created_at timestamptz not null default now(),
  unique (journey_response_id, position)
);

comment on table public.journey_response_fractals is
  'Respostas, hierarquias, justificativas e reflexão final de cada fractal respondido.';

comment on column public.journey_response_fractals.final_feeling is
  'Reflexão do avaliado após aquela tarefa específica. Não é reflexão única para todos os fractais.';

-- 3) Índices auxiliares.
create index if not exists journey_fractals_journey_id_idx
  on public.journey_fractals(journey_id);

create index if not exists journey_response_fractals_response_id_idx
  on public.journey_response_fractals(journey_response_id);

create index if not exists journey_response_fractals_fractal_id_idx
  on public.journey_response_fractals(journey_fractal_id);

-- 4) RLS nas novas tabelas.
alter table public.journey_fractals enable row level security;
alter table public.journey_response_fractals enable row level security;

-- Remove políticas anteriores desta release se a migration for reexecutada em ambiente de teste.
drop policy if exists "journey_fractals_manage_by_organization" on public.journey_fractals;
drop policy if exists "journey_response_fractals_select_by_organization" on public.journey_response_fractals;

create policy "journey_fractals_manage_by_organization"
  on public.journey_fractals
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.journeys j
      join public.profiles p on p.organization_id = j.organization_id
      where j.id = journey_fractals.journey_id
        and p.auth_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.journeys j
      join public.profiles p on p.organization_id = j.organization_id
      where j.id = journey_fractals.journey_id
        and p.auth_user_id = auth.uid()
    )
  );

create policy "journey_response_fractals_select_by_organization"
  on public.journey_response_fractals
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.journey_responses jr
      join public.journeys j on j.id = jr.journey_id
      join public.profiles p on p.organization_id = j.organization_id
      where jr.id = journey_response_fractals.journey_response_id
        and p.auth_user_id = auth.uid()
    )
  );

grant select, insert, update, delete on public.journey_fractals to authenticated;
grant select on public.journey_response_fractals to authenticated;

-- 5) Compatibilidade: cria Fractal 1 para jornadas antigas.
insert into public.journey_fractals (journey_id, position, activity)
select
  j.id,
  1,
  coalesce(nullif(trim(j.activity), ''), 'Fractal de Comportamento')
from public.journeys j
where not exists (
  select 1
  from public.journey_fractals jf
  where jf.journey_id = j.id
    and jf.position = 1
)
on conflict (journey_id, position) do nothing;

-- 6) Compatibilidade: cria respostas de Fractal 1 para registros antigos já respondidos.
insert into public.journey_response_fractals (
  journey_response_id,
  journey_fractal_id,
  position,
  presented_activity,
  copied_activity,
  response_1,
  hierarchy_1,
  justification_1,
  response_2,
  hierarchy_2,
  justification_2,
  response_3,
  hierarchy_3,
  justification_3,
  final_feeling
)
select
  jr.id,
  jf.id,
  1,
  coalesce(nullif(trim(j.activity), ''), nullif(trim(jr.behavior_fractal), ''), 'Fractal de Comportamento'),
  coalesce(nullif(trim(jr.behavior_fractal), ''), coalesce(nullif(trim(j.activity), ''), 'Fractal de Comportamento')),
  coalesce(jr.response_1, ''),
  coalesce(nullif(jr.hierarchy_1, 0), 3),
  coalesce(jr.justification_1, ''),
  coalesce(jr.response_2, ''),
  coalesce(nullif(jr.hierarchy_2, 0), 2),
  coalesce(jr.justification_2, ''),
  coalesce(jr.response_3, ''),
  coalesce(nullif(jr.hierarchy_3, 0), 1),
  coalesce(jr.justification_3, ''),
  coalesce(jr.final_feeling, '')
from public.journey_responses jr
join public.journeys j on j.id = jr.journey_id
join public.journey_fractals jf on jf.journey_id = j.id and jf.position = 1
where not exists (
  select 1
  from public.journey_response_fractals jrf
  where jrf.journey_response_id = jr.id
    and jrf.position = 1
)
on conflict (journey_response_id, position) do nothing;

-- 7) Contexto público do link da versão 1.2.0, agora com lista de fractais.
-- IMPORTANTE: mantemos a função antiga get_public_journey_context_by_token(text) intacta
-- para preservar compatibilidade com a versão estável 1.1.10.
create or replace function public.get_public_journey_context_v2_by_token(p_token text)
returns table (
  activity text,
  applicator_name text,
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
  group by j.id, j.activity, a.name;
$$;

grant execute on function public.get_public_journey_context_v2_by_token(text)
  to anon, authenticated;

-- 8) Função pública de envio da versão 1.2.0.
create or replace function public.submit_public_journey_response_v2(
  p_token text,
  p_application_date date,
  p_initial_time text,
  p_full_name text,
  p_email text,
  p_naturalidade text,
  p_cpf text,
  p_birth_date date,
  p_participation_objective text,
  p_application_type text,
  p_applicator_name text,
  p_activity_choice text,
  p_fractals jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_journey public.journeys%rowtype;
  v_response_id uuid;
  v_first jsonb;
  v_item jsonb;
  v_fractal_id uuid;
  v_position integer;
  v_count integer;
  v_initial_time time without time zone;
begin
  if p_fractals is null or jsonb_typeof(p_fractals) <> 'array' then
    raise exception 'Fractais não informados.';
  end if;

  v_count := jsonb_array_length(p_fractals);

  if v_count < 1 or v_count > 3 then
    raise exception 'Informe de 1 a 3 fractais.';
  end if;

  v_initial_time := nullif(trim(coalesce(p_initial_time, '')), '')::time without time zone;

  select *
  into v_journey
  from public.journeys
  where token = p_token
  for update;

  if not found then
    raise exception 'Link não encontrado.';
  end if;

  if v_journey.status in ('completed', 'exported') then
    raise exception 'Este link já foi utilizado e não aceita novas respostas.';
  end if;

  v_first := p_fractals -> 0;

  insert into public.journey_responses (
    journey_id,
    application_date,
    initial_time,
    full_name,
    email,
    naturalidade,
    cpf,
    birth_date,
    participation_objective,
    application_type,
    applicator_name,
    activity_choice,
    behavior_fractal,
    response_1,
    hierarchy_1,
    justification_1,
    response_2,
    hierarchy_2,
    justification_2,
    response_3,
    hierarchy_3,
    justification_3,
    final_feeling
  ) values (
    v_journey.id,
    p_application_date,
    nullif(trim(p_initial_time), '')::time,
    trim(p_full_name),
    trim(p_email),
    trim(p_naturalidade),
    trim(p_cpf),
    p_birth_date,
    trim(p_participation_objective),
    trim(p_application_type),
    trim(p_applicator_name),
    trim(p_activity_choice),
    trim(v_first ->> 'copied_activity'),
    trim(v_first ->> 'response_1'),
    (v_first ->> 'hierarchy_1')::integer,
    trim(v_first ->> 'justification_1'),
    trim(v_first ->> 'response_2'),
    (v_first ->> 'hierarchy_2')::integer,
    trim(v_first ->> 'justification_2'),
    trim(v_first ->> 'response_3'),
    (v_first ->> 'hierarchy_3')::integer,
    trim(v_first ->> 'justification_3'),
    trim(v_first ->> 'final_feeling')
  ) returning id into v_response_id;

  for v_item in
    select value
    from jsonb_array_elements(p_fractals) as items(value)
    order by (value ->> 'position')::integer
  loop
    v_position := (v_item ->> 'position')::integer;
    v_fractal_id := nullif(v_item ->> 'fractal_id', '')::uuid;

    if v_position < 1 or v_position > 3 then
      raise exception 'Posição de fractal inválida.';
    end if;

    if v_fractal_id is not null and not exists (
      select 1
      from public.journey_fractals jf
      where jf.id = v_fractal_id
        and jf.journey_id = v_journey.id
        and jf.position = v_position
    ) then
      raise exception 'Fractal inválido para este link.';
    end if;

    insert into public.journey_response_fractals (
      journey_response_id,
      journey_fractal_id,
      position,
      presented_activity,
      copied_activity,
      response_1,
      hierarchy_1,
      justification_1,
      response_2,
      hierarchy_2,
      justification_2,
      response_3,
      hierarchy_3,
      justification_3,
      final_feeling
    ) values (
      v_response_id,
      v_fractal_id,
      v_position,
      trim(v_item ->> 'presented_activity'),
      trim(v_item ->> 'copied_activity'),
      trim(v_item ->> 'response_1'),
      (v_item ->> 'hierarchy_1')::integer,
      trim(v_item ->> 'justification_1'),
      trim(v_item ->> 'response_2'),
      (v_item ->> 'hierarchy_2')::integer,
      trim(v_item ->> 'justification_2'),
      trim(v_item ->> 'response_3'),
      (v_item ->> 'hierarchy_3')::integer,
      trim(v_item ->> 'justification_3'),
      trim(v_item ->> 'final_feeling')
    );
  end loop;

  update public.journeys
  set status = 'completed', completed_at = now()
  where id = v_journey.id;
end;
$$;

grant execute on function public.submit_public_journey_response_v2(
  text,
  date,
  text,
  text,
  text,
  text,
  text,
  date,
  text,
  text,
  text,
  text,
  jsonb
) to anon, authenticated;
