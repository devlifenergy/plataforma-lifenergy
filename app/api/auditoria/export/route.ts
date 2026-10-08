import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";

type ProfileRow = {
  id: string;
  role: string;
  organization_id: string | null;
};

type AuditFilters = {
  organizationId: string;
  user: string;
  action: string;
  entity: string;
  startDate: string;
  endDate: string;
  q: string;
};

const actionLabels: Record<string, string> = {
  "legal.company_acceptance": "Aceite legal da empresa",
  "journey.created": "Link de aplicação criado",
  "journey.updated": "Link de aplicação editado",
  "journey.deleted": "Link de aplicação excluído",
  "journey.invitation_email_sent": "Convite enviado por e-mail",
  "public_form.completed": "Formulário público concluído",
  "report.relational_generated": "Relatório Lifenergy gerado",
  "pdi.generated": "Trilha/PDI gerado",
  "document.downloaded": "Documento baixado",
  "company.created": "Empresa criada",
  "company.updated": "Empresa atualizada",
  "license.updated": "Licenças atualizadas",
};

function cleanSearchValue(value: string) {
  return value.replace(/[%,()]/g, " ").replace(/\s+/g, " ").trim();
}

function readFilters(url: URL): AuditFilters {
  return {
    organizationId: url.searchParams.get("organization_id")?.trim() || "",
    user: url.searchParams.get("user")?.trim() || "",
    action: url.searchParams.get("action")?.trim() || "",
    entity: url.searchParams.get("entity")?.trim() || "",
    startDate: url.searchParams.get("start_date")?.trim() || "",
    endDate: url.searchParams.get("end_date")?.trim() || "",
    q: url.searchParams.get("q")?.trim() || "",
  };
}

function applyAuditFilters(query: any, filters: AuditFilters, profile: ProfileRow) {
  const isSuperAdmin = profile.role === "super_admin";

  if (isSuperAdmin) {
    if (filters.organizationId) query = query.eq("organization_id", filters.organizationId);
  } else if (profile.organization_id) {
    query = query.eq("organization_id", profile.organization_id);
  } else {
    query = query.eq("organization_id", "__sem_organizacao__");
  }

  if (filters.action) query = query.eq("action", filters.action);
  if (filters.startDate) query = query.gte("created_at", `${filters.startDate}T00:00:00`);
  if (filters.endDate) query = query.lte("created_at", `${filters.endDate}T23:59:59`);

  const userFilter = cleanSearchValue(filters.user);
  if (userFilter) {
    query = query.or(`actor_name.ilike.%${userFilter}%,actor_email.ilike.%${userFilter}%`);
  }

  const entityFilter = cleanSearchValue(filters.entity);
  if (entityFilter) {
    query = query.or(`entity_type.ilike.%${entityFilter}%,entity_id.ilike.%${entityFilter}%`);
  }

  const textualSearch = cleanSearchValue(filters.q);
  if (textualSearch) {
    query = query.or(
      `description.ilike.%${textualSearch}%,actor_email.ilike.%${textualSearch}%,actor_name.ilike.%${textualSearch}%,organization_name.ilike.%${textualSearch}%,action.ilike.%${textualSearch}%`
    );
  }

  return query;
}

function formatDate(value: string | null) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "medium",
      timeZone: "America/Sao_Paulo",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function csvValue(value: unknown) {
  if (value === null || value === undefined) return "";
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, organization_id")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Perfil não encontrado." }, { status: 403 });
  }

  const admin = createAdminClient();
  const filters = readFilters(new URL(request.url));
  const typedProfile = profile as ProfileRow;

  let query: any = admin
    .from("audit_logs")
    .select("id, organization_id, organization_name, actor_name, actor_email, action, entity_type, entity_id, description, metadata, ip_address, user_agent, created_at")
    .order("created_at", { ascending: false })
    .limit(5000);

  query = applyAuditFilters(query, filters, typedProfile);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = data ?? [];
  const header = [
    "data_hora",
    "acao_legivel",
    "acao",
    "usuario_nome",
    "usuario_email",
    "empresa",
    "entidade_tipo",
    "entidade_id",
    "descricao",
    "ip_origem",
    "user_agent",
    "metadata_json",
  ];

  const csvRows = [
    header.map(csvValue).join(","),
    ...rows.map((row: any) =>
      [
        formatDate(row.created_at),
        actionLabels[row.action] ?? row.action,
        row.action,
        row.actor_name ?? "",
        row.actor_email ?? "",
        row.organization_name ?? "",
        row.entity_type ?? "",
        row.entity_id ?? "",
        row.description ?? "",
        row.ip_address ?? "",
        row.user_agent ?? "",
        row.metadata ?? {},
      ].map(csvValue).join(",")
    ),
  ];

  const csv = `\uFEFF${csvRows.join("\n")}`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="auditoria_lifenergy_${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
