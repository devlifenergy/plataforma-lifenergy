-- Patch 1.5.15 - Garante coluna organization_name na auditoria
-- Necessário quando a tabela audit_logs já existia antes da versão consolidada da migration 1.5.15.

alter table if exists public.audit_logs
  add column if not exists organization_name text;

comment on column public.audit_logs.organization_name
  is 'Nome da organização no momento do evento de auditoria, usado para exibição e histórico.';
