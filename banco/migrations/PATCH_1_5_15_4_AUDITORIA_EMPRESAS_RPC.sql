-- Hotfix 1.5.15.4
-- Auditoria confiavel para a tela Empresas.
-- Cria uma RPC SECURITY DEFINER para registrar eventos de empresas/licencas
-- usando a sessao autenticada como fonte do ator.

create or replace function public.lifenergy_insert_company_audit_log(
  p_organization_id uuid,
  p_organization_name text,
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_description text,
  p_metadata jsonb default '{}'::jsonb
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
    metadata
  )
  values (
    p_organization_id,
    p_organization_name,
    v_actor_user_id,
    v_actor_profile_id,
    v_actor_user_id,
    coalesce(v_actor_name, v_actor_email, 'Superusuário'),
    v_actor_email,
    p_action,
    coalesce(p_entity_type, 'organization'),
    coalesce(p_entity_type, 'organization'),
    p_entity_id,
    p_description,
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

revoke all on function public.lifenergy_insert_company_audit_log(uuid, text, text, text, uuid, text, jsonb) from public;
grant execute on function public.lifenergy_insert_company_audit_log(uuid, text, text, text, uuid, text, jsonb) to authenticated;
