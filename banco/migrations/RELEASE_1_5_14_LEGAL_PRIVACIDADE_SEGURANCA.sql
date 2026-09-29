-- RELEASE 1.5.14
-- Base legal inicial: termos, política de privacidade e registro de ciência do participante.
-- Execute primeiro no Supabase Sandbox antes de publicar o deploy que envia estes campos.

alter table if exists public.journey_responses
  add column if not exists privacy_accepted_at timestamptz,
  add column if not exists privacy_policy_version text,
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists terms_version text;

comment on column public.journey_responses.privacy_accepted_at
  is 'Data e hora em que o participante declarou ciência da Política de Privacidade na aplicação on-line.';

comment on column public.journey_responses.privacy_policy_version
  is 'Versão da Política de Privacidade vigente no momento da ciência do participante.';

comment on column public.journey_responses.terms_accepted_at
  is 'Data e hora em que o participante declarou ciência dos Termos de Uso na aplicação on-line.';

comment on column public.journey_responses.terms_version
  is 'Versão dos Termos de Uso vigente no momento da ciência do participante.';

create index if not exists journey_responses_privacy_accepted_at_idx
  on public.journey_responses (privacy_accepted_at);

create index if not exists journey_responses_terms_accepted_at_idx
  on public.journey_responses (terms_accepted_at);
