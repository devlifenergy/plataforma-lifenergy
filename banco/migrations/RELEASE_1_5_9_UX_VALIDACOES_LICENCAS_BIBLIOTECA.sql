-- Release 1.5.9 - UX, validacoes, licencas, bibliotecas e logo configuravel

alter table public.organizations
  add column if not exists logo_size text,
  add column if not exists logo_position text,
  add column if not exists license_individual_reports integer,
  add column if not exists license_pdi_relational integer,
  add column if not exists license_pdi_corporate integer,
  add column if not exists licenses_started_at timestamptz;

update public.organizations set logo_size = coalesce(logo_size, 'medium');
update public.organizations set logo_position = coalesce(logo_position, 'center');
update public.organizations set licenses_started_at = coalesce(licenses_started_at, now());

alter table public.organizations
  alter column logo_size set default 'medium',
  alter column logo_position set default 'center',
  alter column licenses_started_at set default now();

do $$ begin
  alter table public.organizations add constraint organizations_logo_size_check check (logo_size in ('small','medium','large'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.organizations add constraint organizations_logo_position_check check (logo_position in ('left','center','right'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.organizations add constraint organizations_license_individual_nonnegative check (license_individual_reports is null or license_individual_reports >= 0);
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.organizations add constraint organizations_license_relational_nonnegative check (license_pdi_relational is null or license_pdi_relational >= 0);
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.organizations add constraint organizations_license_corporate_nonnegative check (license_pdi_corporate is null or license_pdi_corporate >= 0);
exception when duplicate_object then null; end $$;

alter table public.profiles add column if not exists must_change_password boolean not null default false;

create table if not exists public.participant_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  journey_response_id uuid references public.journey_responses(id) on delete cascade,
  participant_cpf text not null,
  title text not null,
  category text,
  file_name text not null,
  mime_type text,
  file_size bigint,
  file_content_base64 text not null,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists participant_documents_org_cpf_idx on public.participant_documents(organization_id, participant_cpf);
create index if not exists participant_documents_response_idx on public.participant_documents(journey_response_id);

alter table public.participant_documents enable row level security;

do $$ begin
  create policy participant_documents_select_org on public.participant_documents
    for select using (
      exists (select 1 from public.profiles p where p.auth_user_id = auth.uid() and (p.role = 'super_admin' or p.organization_id = participant_documents.organization_id))
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy participant_documents_write_org on public.participant_documents
    for all using (
      exists (select 1 from public.profiles p where p.auth_user_id = auth.uid() and (p.role = 'super_admin' or p.organization_id = participant_documents.organization_id))
    ) with check (
      exists (select 1 from public.profiles p where p.auth_user_id = auth.uid() and (p.role = 'super_admin' or p.organization_id = participant_documents.organization_id))
    );
exception when duplicate_object then null; end $$;

create table if not exists public.technical_library_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_name text not null,
  mime_type text,
  file_size bigint,
  file_content_base64 text not null,
  is_public boolean not null default true,
  status text not null default 'active',
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.technical_library_documents enable row level security;

do $$ begin
  create policy technical_library_public_read on public.technical_library_documents
    for select using (is_public = true and status = 'active');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy technical_library_authenticated_read on public.technical_library_documents
    for select to authenticated using (status = 'active');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy technical_library_superadmin_write on public.technical_library_documents
    for all to authenticated using (
      exists (select 1 from public.profiles p where p.auth_user_id = auth.uid() and p.role = 'super_admin')
    ) with check (
      exists (select 1 from public.profiles p where p.auth_user_id = auth.uid() and p.role = 'super_admin')
    );
exception when duplicate_object then null; end $$;

select 'release_1_5_9_ux_validacoes_licencas_bibliotecas_ok' as status;
