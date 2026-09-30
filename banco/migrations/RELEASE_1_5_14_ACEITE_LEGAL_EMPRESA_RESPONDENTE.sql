-- RELEASE 1.5.14
-- Aceite legal separado para empresa e respondente.
-- Execute no Supabase Sandbox antes do deploy do hotfix.

alter table if exists public.profiles
  add column if not exists company_terms_accepted_at timestamptz,
  add column if not exists company_terms_version text,
  add column if not exists company_privacy_accepted_at timestamptz,
  add column if not exists company_privacy_policy_version text;

comment on column public.profiles.company_terms_accepted_at
  is 'Data e hora em que o usuário da empresa aceitou os Termos de Uso do Cliente/Empresa.';

comment on column public.profiles.company_terms_version
  is 'Versão dos Termos de Uso do Cliente/Empresa aceita pelo usuário da empresa.';

comment on column public.profiles.company_privacy_accepted_at
  is 'Data e hora em que o usuário da empresa aceitou a Política de Privacidade.';

comment on column public.profiles.company_privacy_policy_version
  is 'Versão da Política de Privacidade aceita pelo usuário da empresa.';

create index if not exists profiles_company_terms_accepted_at_idx
  on public.profiles (company_terms_accepted_at);

create index if not exists profiles_company_privacy_accepted_at_idx
  on public.profiles (company_privacy_accepted_at);
