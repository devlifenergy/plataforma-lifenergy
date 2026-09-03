-- ============================================================================
-- LIFENERGY DIGITAL — RELEASE 1.5.8
-- Logomarca da empresa e matriz de escolha de fractais
-- ============================================================================
-- Execute no Supabase Sandbox depois da 1.5.6.
-- ============================================================================

-- 1) Logomarca da empresa para cabeçalho de relatórios.
alter table public.organizations
  add column if not exists logo_file_name text,
  add column if not exists logo_mime_type text,
  add column if not exists logo_content_base64 text,
  add column if not exists logo_updated_at timestamptz;

comment on column public.organizations.logo_file_name is 'Nome original do arquivo de logomarca da empresa.';
comment on column public.organizations.logo_mime_type is 'Tipo MIME da logomarca da empresa. Nesta versão, PNG ou JPG.';
comment on column public.organizations.logo_content_base64 is 'Conteúdo da logomarca em base64 para uso no cabeçalho dos relatórios gerados.';
comment on column public.organizations.logo_updated_at is 'Data/hora da última atualização da logomarca da empresa.';

-- 2) Metadados da matriz Lifenergy na seleção dos fractais do convite.
alter table public.journey_fractals
  add column if not exists vortex text,
  add column if not exists connection_point text,
  add column if not exists fractal_code text;

comment on column public.journey_fractals.vortex is 'Vórtice selecionado na matriz Lifenergy para o fractal.';
comment on column public.journey_fractals.connection_point is 'Ponto de Conexão selecionado na matriz Lifenergy para o fractal.';
comment on column public.journey_fractals.fractal_code is 'Código do fractal selecionado na matriz Lifenergy.';

alter table public.journey_response_fractals
  add column if not exists vortex text,
  add column if not exists connection_point text,
  add column if not exists fractal_code text;

comment on column public.journey_response_fractals.vortex is 'Vórtice da matriz Lifenergy usado no fractal respondido.';
comment on column public.journey_response_fractals.connection_point is 'Ponto de Conexão da matriz Lifenergy usado no fractal respondido.';
comment on column public.journey_response_fractals.fractal_code is 'Código do fractal da matriz Lifenergy usado no fractal respondido.';

-- 3) Atualiza o contexto público para devolver metadados da matriz dentro do JSON de fractais.
create or replace function public.get_public_journey_context_v2_by_token(p_token text)
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
          'activity', jf.activity,
          'vortex', coalesce(jf.vortex, ''),
          'connection_point', coalesce(jf.connection_point, ''),
          'fractal_code', coalesce(jf.fractal_code, '')
        )
        order by jf.position
      ) filter (where jf.id is not null),
      jsonb_build_array(
        jsonb_build_object(
          'id', null,
          'position', 1,
          'activity', coalesce(nullif(trim(j.activity), ''), 'Fractal de Comportamento'),
          'vortex', '',
          'connection_point', '',
          'fractal_code', ''
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

select 'release_1_5_8_logo_matriz_fractais_ok' as status, now() as applied_at;
