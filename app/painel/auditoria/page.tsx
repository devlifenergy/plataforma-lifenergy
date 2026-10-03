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
  "report.relational_generated": "Relatório Relacional gerado",
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
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
          Auditoria e rastreabilidade
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#0F2A43]">
          Eventos do Lifenergy Digital
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Esta tela apresenta os registros recentes de ações críticas do sistema, incluindo aceite legal,
          criação de aplicações, conclusão de formulários, geração de documentos e downloads.
        </p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Não foi possível carregar a auditoria: {error.message}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#0F2A43]">Registros recentes</h2>
          <p className="mt-1 text-sm text-slate-500">
            Exibindo os últimos 100 eventos disponíveis para o seu perfil.
          </p>
        </div>

        {logs.length === 0 ? (
          <div className="px-6 py-10 text-sm text-slate-500">
            Nenhum evento de auditoria registrado ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Data/hora</th>
                  <th className="px-5 py-3 font-semibold">Ação</th>
                  <th className="px-5 py-3 font-semibold">Usuário</th>
                  <th className="px-5 py-3 font-semibold">Empresa</th>
                  <th className="px-5 py-3 font-semibold">Entidade</th>
                  <th className="px-5 py-3 font-semibold">Descrição</th>
                  <th className="px-5 py-3 font-semibold">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="align-top hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#0F2A43]">
                        {actionLabels[log.action] ?? log.action}
                      </span>
                      <p className="mt-1 text-xs text-slate-400">{log.action}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <p className="font-medium text-slate-700">{log.actor_name || "Sistema"}</p>
                      <p className="mt-1 text-xs text-slate-400">{log.actor_email || "-"}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{log.organization_name || "-"}</td>
                    <td className="px-5 py-4 text-slate-600">
                      <p>{log.entity_type || "-"}</p>
                      <p className="mt-1 max-w-[180px] truncate text-xs text-slate-400">
                        {log.entity_id || "-"}
                      </p>
                    </td>
                    <td className="max-w-[280px] px-5 py-4 leading-6 text-slate-600">
                      {log.description || "-"}
                    </td>
                    <td className="px-5 py-4">
                      <details className="group">
                        <summary className="cursor-pointer text-sm font-semibold text-[#0F2A43] transition hover:text-[#B98A2E]">
                          Ver detalhes
                        </summary>
                        <pre className="mt-3 max-h-56 max-w-[360px] overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
{formatMetadata({
  ...(log.metadata ?? {}),
  ip_address: log.ip_address,
  user_agent: log.user_agent,
})}
                        </pre>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
