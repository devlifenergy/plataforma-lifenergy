-- ============================================================================
-- LIFENERGY DIGITAL — RELEASE 1.3.2
-- Motor Canônico de Relatório Lifenergy V1.0
-- ============================================================================
-- Execute no Supabase Sandbox antes de testar a geração do relatório 1.3.2.
-- Não execute na produção enquanto a release estiver em validação.
-- ============================================================================

alter table if exists public.generated_reports
  add column if not exists engine_version text,
  add column if not exists prompt_version text,
  add column if not exists template_version text;

comment on column public.generated_reports.engine_version is
  'Versão do motor de geração do relatório Lifenergy.';

comment on column public.generated_reports.prompt_version is
  'Versão do Prompt Mestre usado para gerar o conteúdo interpretativo.';

comment on column public.generated_reports.template_version is
  'Versão do template DOCX usado para montar o relatório.';

-- Mantém histórico das versões antigas e permite que a 1.3.2 gere um novo
-- relatório canônico sem sobrescrever relatórios anteriores da 1.3.0/1.3.1.

select
  'release_1_3_2_motor_canonico_relatorio_aplicada' as status,
  now() as applied_at;
