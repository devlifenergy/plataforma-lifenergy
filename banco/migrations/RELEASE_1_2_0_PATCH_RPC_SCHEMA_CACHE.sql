-- RELEASE 1.2.0 - Patch RPC multifractal / schema cache
-- Execute este arquivo no Supabase SQL Editor.
-- Objetivo:
-- 1) Remover apenas versões anteriores da função NOVA da 1.2.0.
-- 2) Recriar a função com assinatura textual, compatível com chamada via PostgREST/Supabase RPC.
-- 3) Recarregar explicitamente o schema cache do PostgREST.
--
-- Esta migration NÃO altera a função antiga da versão estável 1.1.10.
-- Esta migration NÃO apaga dados existentes.

-- Remove somente overloads/versões da função nova multifractal.
do $$
declare
  r record;
begin
  for r in
    select p.oid::regprocedure as signature
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'submit_public_journey_response_multifractal'
  loop
    execute format('drop function if exists %s cascade', r.signature);
  end loop;
end;
$$;

create function public.submit_public_journey_response_multifractal(
  p_token text,
  p_application_date text,
  p_initial_time_text text,
  p_full_name text,
  p_email text,
  p_naturalidade text,
  p_cpf text,
  p_birth_date text,
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
  v_application_date date;
  v_birth_date date;
begin
  if p_fractals is null or jsonb_typeof(p_fractals) <> 'array' then
    raise exception 'Fractais não informados.';
  end if;

  v_count := jsonb_array_length(p_fractals);

  if v_count < 1 or v_count > 3 then
    raise exception 'Informe de 1 a 3 fractais.';
  end if;

  -- Conversões explícitas para evitar erro de tipos no PostgreSQL.
  v_application_date := case
    when nullif(trim(coalesce(p_application_date, '')), '') is null then null
    else nullif(trim(coalesce(p_application_date, '')), '')::date
  end;

  v_birth_date := case
    when nullif(trim(coalesce(p_birth_date, '')), '') is null then null
    else nullif(trim(coalesce(p_birth_date, '')), '')::date
  end;

  v_initial_time := case
    when nullif(trim(coalesce(p_initial_time_text, '')), '') is null then null
    else nullif(trim(coalesce(p_initial_time_text, '')), '')::time without time zone
  end;

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
    v_application_date,
    v_initial_time,
    trim(coalesce(p_full_name, '')),
    trim(coalesce(p_email, '')),
    trim(coalesce(p_naturalidade, '')),
    trim(coalesce(p_cpf, '')),
    v_birth_date,
    trim(coalesce(p_participation_objective, '')),
    trim(coalesce(p_application_type, '')),
    trim(coalesce(p_applicator_name, '')),
    trim(coalesce(p_activity_choice, '')),
    trim(coalesce(v_first ->> 'copied_activity', '')),
    trim(coalesce(v_first ->> 'response_1', '')),
    nullif(trim(coalesce(v_first ->> 'hierarchy_1', '')), '')::integer,
    trim(coalesce(v_first ->> 'justification_1', '')),
    trim(coalesce(v_first ->> 'response_2', '')),
    nullif(trim(coalesce(v_first ->> 'hierarchy_2', '')), '')::integer,
    trim(coalesce(v_first ->> 'justification_2', '')),
    trim(coalesce(v_first ->> 'response_3', '')),
    nullif(trim(coalesce(v_first ->> 'hierarchy_3', '')), '')::integer,
    trim(coalesce(v_first ->> 'justification_3', '')),
    trim(coalesce(v_first ->> 'final_feeling', ''))
  ) returning id into v_response_id;

  for v_item in
    select value
    from jsonb_array_elements(p_fractals) as items(value)
    order by nullif(trim(value ->> 'position'), '')::integer
  loop
    v_position := nullif(trim(coalesce(v_item ->> 'position', '')), '')::integer;
    v_fractal_id := nullif(trim(coalesce(v_item ->> 'fractal_id', '')), '')::uuid;

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
      trim(coalesce(v_item ->> 'presented_activity', '')),
      trim(coalesce(v_item ->> 'copied_activity', '')),
      trim(coalesce(v_item ->> 'response_1', '')),
      nullif(trim(coalesce(v_item ->> 'hierarchy_1', '')), '')::integer,
      trim(coalesce(v_item ->> 'justification_1', '')),
      trim(coalesce(v_item ->> 'response_2', '')),
      nullif(trim(coalesce(v_item ->> 'hierarchy_2', '')), '')::integer,
      trim(coalesce(v_item ->> 'justification_2', '')),
      trim(coalesce(v_item ->> 'response_3', '')),
      nullif(trim(coalesce(v_item ->> 'hierarchy_3', '')), '')::integer,
      trim(coalesce(v_item ->> 'justification_3', '')),
      trim(coalesce(v_item ->> 'final_feeling', ''))
    );
  end loop;

  update public.journeys
  set status = 'completed', completed_at = now()
  where id = v_journey.id;
end;
$$;

grant execute on function public.submit_public_journey_response_multifractal(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb
) to anon, authenticated;

-- Recarrega o schema cache usado pela API REST/RPC do Supabase.
notify pgrst, 'reload schema';

-- Verificação rápida: deve retornar 1 linha com todos os argumentos em text/jsonb.
select
  p.proname as funcao,
  p.oid::regprocedure as assinatura
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'submit_public_journey_response_multifractal';
