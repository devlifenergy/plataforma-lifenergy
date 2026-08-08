-- RELEASE 1.2.0 - Patch de formulário/resumo/tempo
-- Execute este arquivo no Supabase SQL Editor se a migration principal da 1.2.0 já foi aplicada.
-- Corrige a conversão do campo initial_time para time without time zone.

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
begin
  if p_fractals is null or jsonb_typeof(p_fractals) <> 'array' then
    raise exception 'Fractais não informados.';
  end if;

  v_count := jsonb_array_length(p_fractals);

  if v_count < 1 or v_count > 3 then
    raise exception 'Informe de 1 a 3 fractais.';
  end if;

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
