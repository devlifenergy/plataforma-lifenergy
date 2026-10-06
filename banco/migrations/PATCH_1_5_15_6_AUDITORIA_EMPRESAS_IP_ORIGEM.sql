-- Hotfix 1.5.15.6
-- Corrige a Origem/IP nos logs da tela Empresas.
-- A versao 1.5.15.5 corrigiu o user_id/profile_id, mas a RPC nao recebia
-- ip_address e user_agent. Por isso a tela exibia "IP Nao informado".

-- Remove a assinatura anterior para evitar sobrecarga ambigua da RPC.
drop function if exists public.lifenergy_insert_company_audit_log(uuid, text, text, text, uuid, text, jsonb);
drop function if exists public.lifenergy_insert_company_audit_log(uuid, text, text, text, uuid, text, jsonb, text, text);

create or replace function public.lifenergy_insert_company_audit_log(
  p_organization_id uuid,
  p_organization_name text,
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_description text,
  p_metadata jsonb default '{}'::jsonb,
  p_ip_address text default null,
  p_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_user_id uuid := auth.uid();
  v_actor_profile_id uuid;
  v_actor_name text;
  v_actor_email text;
  v_actor_role text;
begin
  if v_actor_user_id is null then
    raise exception 'Usuario nao autenticado para registrar auditoria.';
  end if;

  select
    p.id,
    p.name,
    p.email,
    p.role
  into
    v_actor_profile_id,
    v_actor_name,
    v_actor_email,
    v_actor_role
  from public.profiles p
  where p.auth_user_id = v_actor_user_id
  limit 1;

  if v_actor_profile_id is null then
    raise exception 'Perfil do usuario autenticado nao encontrado para auditoria.';
  end if;

  if v_actor_role is distinct from 'super_admin' then
    raise exception 'Apenas super_admin pode registrar auditoria da tela Empresas.';
  end if;

  insert into public.audit_logs (
    organization_id,
    organization_name,
    user_id,
    actor_profile_id,
    actor_user_id,
    actor_name,
    actor_email,
    action,
    entity,
    entity_type,
    entity_id,
    description,
    metadata,
    ip_address,
    user_agent
  )
  values (
    p_organization_id,
    p_organization_name,
    v_actor_profile_id,
    v_actor_profile_id,
    v_actor_user_id,
    coalesce(v_actor_name, v_actor_email, 'Superusuario'),
    v_actor_email,
    p_action,
    coalesce(p_entity_type, 'organization'),
    coalesce(p_entity_type, 'organization'),
    p_entity_id,
    p_description,
    coalesce(p_metadata, '{}'::jsonb),
    nullif(trim(p_ip_address), ''),
    nullif(trim(p_user_agent), '')
  );
end;
$$;

revoke all on function public.lifenergy_insert_company_audit_log(uuid, text, text, text, uuid, text, jsonb, text, text) from public;
grant execute on function public.lifenergy_insert_company_audit_log(uuid, text, text, text, uuid, text, jsonb, text, text) to authenticated;
