-- RELEASE 1.5.10
-- Biblioteca Técnica: links externos e visualização de documentos.
-- Migration incremental e compatível com registros existentes.

alter table public.technical_library_documents
  add column if not exists external_url text;

comment on column public.technical_library_documents.external_url is
  'Link externo opcional associado ao conteúdo técnico, como YouTube ou página web.';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'technical_library_documents_external_url_protocol_check'
      and conrelid = 'public.technical_library_documents'::regclass
  ) then
    alter table public.technical_library_documents
      add constraint technical_library_documents_external_url_protocol_check
      check (
        external_url is null
        or external_url ~* '^https?://'
      );
  end if;
end
$$;

select
  'release_1_5_10_biblioteca_tecnica_links_visualizacao_ok' as status,
  now() as applied_at;
