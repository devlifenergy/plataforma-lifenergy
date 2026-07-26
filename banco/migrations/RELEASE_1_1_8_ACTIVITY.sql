-- Release 1.1.8 — atividade por convite

alter table public.journeys
  add column if not exists activity text;

comment on column public.journeys.activity is
  'Atividade ou fractal apresentado pelo aplicador e vinculado ao link.';

create or replace function public.get_public_journey_context_by_token(p_token text)
returns table (
  activity text,
  applicator_name text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(j.activity, '') as activity,
    coalesce(a.name, '') as applicator_name
  from public.journeys j
  left join public.applicators a on a.id = j.applicator_id
  where j.token = p_token
  limit 1;
$$;

grant execute on function public.get_public_journey_context_by_token(text)
  to anon, authenticated;
