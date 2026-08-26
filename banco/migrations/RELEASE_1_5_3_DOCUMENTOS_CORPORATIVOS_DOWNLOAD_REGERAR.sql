-- ============================================================================
-- LIFENERGY DIGITAL — RELEASE 1.5.3
-- Biblioteca Corporativa: download do documento original e regeneração de PDI
-- ============================================================================
-- Execute no Supabase Sandbox depois da migração 1.5.0.
-- ============================================================================

alter table public.organization_documents
  add column if not exists file_content_base64 text;

comment on column public.organization_documents.file_content_base64 is
  'Conteúdo original do arquivo corporativo em base64 para permitir download pela empresa.';

select 'release_1_5_3_documentos_corporativos_ok' as status, now() as applied_at;
