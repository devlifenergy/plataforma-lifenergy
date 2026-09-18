-- RELEASE 1.5.10 - PATCH CORRETIVO
-- Apaga todos os registros atuais, conforme solicitado.
delete from public.technical_library_documents;

alter table public.technical_library_documents add column if not exists external_url text;
alter table public.technical_library_documents add column if not exists source_format text;
alter table public.technical_library_documents add column if not exists extracted_text text;
alter table public.technical_library_documents add column if not exists extracted_html text;

do $$
begin
  if exists(select 1 from pg_constraint where conname='technical_library_documents_external_url_protocol_check' and conrelid='public.technical_library_documents'::regclass) then
    alter table public.technical_library_documents drop constraint technical_library_documents_external_url_protocol_check;
  end if;
  alter table public.technical_library_documents add constraint technical_library_documents_external_url_protocol_check check(external_url is null or external_url ~* '^https?://');

  if exists(select 1 from pg_constraint where conname='technical_library_documents_source_format_check' and conrelid='public.technical_library_documents'::regclass) then
    alter table public.technical_library_documents drop constraint technical_library_documents_source_format_check;
  end if;
  alter table public.technical_library_documents add constraint technical_library_documents_source_format_check check(source_format is null or source_format in ('pdf','docx'));
end $$;

comment on column public.technical_library_documents.extracted_text is 'Texto extraído automaticamente do PDF/DOCX.';
comment on column public.technical_library_documents.extracted_html is 'HTML semântico extraído automaticamente do DOCX.';
