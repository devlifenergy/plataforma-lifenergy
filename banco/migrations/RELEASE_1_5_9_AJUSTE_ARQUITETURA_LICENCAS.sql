-- Release 1.5.9 - ajuste de arquitetura e licenciamento
-- Regra: documentos gerados antes de licenses_started_at não consomem licenças.
-- A partir deste marco, NULL deixa de significar ilimitado e passa a ser 0.

update public.organizations
set
  license_individual_reports = coalesce(license_individual_reports, 0),
  license_pdi_relational = coalesce(license_pdi_relational, 0),
  license_pdi_corporate = coalesce(license_pdi_corporate, 0),
  licenses_started_at = coalesce(licenses_started_at, now());

alter table public.organizations
  alter column license_individual_reports set default 0,
  alter column license_pdi_relational set default 0,
  alter column license_pdi_corporate set default 0;

select 'release_1_5_9_ajuste_arquitetura_licencas_ok' as status;
