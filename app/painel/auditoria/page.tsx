import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";

type AuditLogRow = {
  id: string;
  organization_id: string | null;
  organization_name: string | null;
  actor_name: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  description: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

const actionLabels: Record<string, string> = {
  "legal.company_acceptance": "Aceite legal da empresa",
  "journey.created": "Link de aplicação criado",
  "journey.updated": "Link de aplicação editado",
  "journey.deleted": "Link de aplicação excluído",
  "journey.invitation_email_sent": "Convite enviado por e-mail",
  "public_form.completed": "Formulário público concluído",
  "report.relational_generated": "Relatório Lifenergy gerado",
  "pdi.generated": "PDI gerado",
  "document.downloaded": "Documento baixado",
  "company.created": "Empresa criada",
  "company.updated": "Empresa atualizada",
  "license.updated": "Licenças atualizadas",
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "America/Sao_Paulo",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatMetadata(metadata: Record<string, unknown> | null) {
  if (!metadata || Object.keys(metadata).length === 0) return "{}";
  return JSON.stringify(metadata, null, 2);
}

function ActionBadge({ action }: { action: string }) {
  return (
    <span className="inline-flex rounded-full bg-[#0F2D4A]/10 px-3 py-1 text-xs font-semibold text-[#0F2D4A]">
      {actionLabels[action] ?? action}
    </span>
  );
}

function AuditLogCard({ log }: { log: AuditLogRow }) {
  const metadataWithContext = {
    ...(log.metadata ?? {}),
    ip_address: log.ip_address,
    user_agent: log.user_agent,
  };

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <ActionBadge action={log.action} />
          <h3 className="mt-3 break-words text-lg font-bold text-[#0F2D4A]">
            {log.description || actionLabels[log.action] || log.action}
          </h3>
          <p className="mt-1 break-all text-xs text-slate-400">{log.action}</p>
        </div>
        <p className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {formatDate(log.created_at)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Usuário</p>
          <p className="mt-2 break-words text-sm font-semibold text-slate-700">
            {log.actor_name || "Sistema"}
          </p>
          <p className="mt-1 break-all text-xs text-slate-500">{log.actor_email || "-"}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Empresa</p>
          <p className="mt-2 break-words text-sm font-semibold text-slate-700">
            {log.organization_name || "-"}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Entidade</p>
          <p className="mt-2 break-words text-sm font-semibold text-slate-700">
            {log.entity_type || "-"}
          </p>
          <p className="mt-1 break-all text-xs text-slate-500">{log.entity_id || "-"}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Origem</p>
          <p className="mt-2 break-words text-sm text-slate-700">
            {log.ip_address || "IP não informado"}
          </p>
        </div>
      </div>

      <details className="mt-4 rounded-2xl border border-slate-200 bg-slate-50">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-[#0F2D4A] transition hover:bg-slate-100">
          Ver detalhes técnicos
        </summary>
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words border-t border-slate-200 bg-slate-950 p-4 text-xs leading-5 text-slate-100">
{formatMetadata(metadataWithContext)}
        </pre>
      </details>
    </article>
  );
}

export default async function AuditPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, organization_id")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/login");
  }

  let query: any = supabase
    .from("audit_logs")
    .select(
      "id, organization_id, organization_name, actor_name, actor_email, action, entity_type, entity_id, description, metadata, ip_address, user_agent, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if ((profile as any).role !== "super_admin") {
    query = query.eq("organization_id", (profile as any).organization_id);
  }

  const { data, error } = await query;
  const logs = (data ?? []) as AuditLogRow[];

  return (
    <div className="max-w-full space-y-6 overflow-x-hidden">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
          Auditoria e rastreabilidade
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#0F2A43]">
          Eventos do Lifenergy Digital
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Acompanhe ações críticas do sistema, incluindo aceite legal, criação de aplicações, conclusão de formulários, geração de documentos e downloads.
        </p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Não foi possível carregar a auditoria: {error.message}
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0F2A43]">Registros recentes</h2>
          <p className="mt-1 text-sm text-slate-500">
            Exibindo os últimos 100 eventos disponíveis para o seu perfil.
          </p>
        </div>

        {logs.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
            Nenhum evento de auditoria registrado ainda.
          </div>
        ) : (
          <div className="grid gap-4">
            {logs.map((log) => (
              <AuditLogCard key={log.id} log={log} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
