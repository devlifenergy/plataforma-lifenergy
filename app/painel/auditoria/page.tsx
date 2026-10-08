import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type ProfileRow = {
  id: string;
  role: string;
  organization_id: string | null;
};

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

type OrganizationOption = {
  id: string;
  name: string;
  status: string | null;
};

type UserOption = {
  name: string;
  email: string;
};

type AuditFilters = {
  organizationId: string;
  user: string;
  action: string;
  entity: string;
  startDate: string;
  endDate: string;
  q: string;
  page: number;
  pageSize: number;
};

const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_OPTIONS = [25, 50, 100];

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

const actionOptions = Object.entries(actionLabels).map(([value, label]) => ({ value, label }));

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function cleanSearchValue(value: string) {
  return value.replace(/[%,()]/g, " ").replace(/\s+/g, " ").trim();
}

function parsePositiveInteger(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function readFilters(params: Record<string, string | string[] | undefined>): AuditFilters {
  const requestedPageSize = parsePositiveInteger(firstValue(params.page_size), DEFAULT_PAGE_SIZE);
  const pageSize = PAGE_SIZE_OPTIONS.includes(requestedPageSize) ? requestedPageSize : DEFAULT_PAGE_SIZE;

  return {
    organizationId: firstValue(params.organization_id).trim(),
    user: firstValue(params.user).trim(),
    action: firstValue(params.action).trim(),
    entity: firstValue(params.entity).trim(),
    startDate: firstValue(params.start_date).trim(),
    endDate: firstValue(params.end_date).trim(),
    q: firstValue(params.q).trim(),
    page: parsePositiveInteger(firstValue(params.page), 1),
    pageSize,
  };
}

function formatDate(value: string) {
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

function formatMetadataValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value, null, 2);
}

function compactUserAgent(value: string | null) {
  if (!value) return "Origem não informada";
  return value.length > 120 ? `${value.slice(0, 120)}...` : value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function licenseLabel(key: string) {
  const labels: Record<string, string> = {
    license_individual_reports: "Relatório Individual",
    license_pdi_relational: "Trilha Lifenergy",
    license_pdi_corporate: "PDI Corporativo",
  };
  return labels[key] ?? key;
}

function getBadgeClasses(action: string) {
  if (action.startsWith("company.")) return "border-blue-200 bg-blue-50 text-blue-700";
  if (action.startsWith("license.")) return "border-amber-200 bg-amber-50 text-amber-700";
  if (action.startsWith("report.")) return "border-violet-200 bg-violet-50 text-violet-700";
  if (action.startsWith("pdi.")) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (action.startsWith("journey.")) return "border-cyan-200 bg-cyan-50 text-cyan-700";
  if (action.startsWith("legal.")) return "border-slate-200 bg-slate-50 text-slate-700";
  return "border-slate-200 bg-white text-slate-700";
}

function buildQueryString(filters: AuditFilters, overrides: Partial<AuditFilters> = {}) {
  const next = { ...filters, ...overrides };
  const query = new URLSearchParams();

  if (next.organizationId) query.set("organization_id", next.organizationId);
  if (next.user) query.set("user", next.user);
  if (next.action) query.set("action", next.action);
  if (next.entity) query.set("entity", next.entity);
  if (next.startDate) query.set("start_date", next.startDate);
  if (next.endDate) query.set("end_date", next.endDate);
  if (next.q) query.set("q", next.q);
  if (next.page > 1) query.set("page", String(next.page));
  if (next.pageSize !== DEFAULT_PAGE_SIZE) query.set("page_size", String(next.pageSize));

  return query.toString();
}

function buildPageHref(filters: AuditFilters, page: number) {
  const query = buildQueryString(filters, { page });
  return query ? `/painel/auditoria?${query}` : "/painel/auditoria";
}

function buildExportHref(filters: AuditFilters) {
  const query = buildQueryString(filters, { page: 1 });
  return query ? `/api/auditoria/export?${query}` : "/api/auditoria/export";
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

  if (filters.action) {
    query = query.eq("action", filters.action);
  }

  if (filters.startDate) {
    query = query.gte("created_at", `${filters.startDate}T00:00:00`);
  }

  if (filters.endDate) {
    query = query.lte("created_at", `${filters.endDate}T23:59:59`);
  }

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

async function loadOrganizations(admin: ReturnType<typeof createAdminClient>, isSuperAdmin: boolean) {
  if (!isSuperAdmin) return [] as OrganizationOption[];

  const { data, error } = await admin
    .from("organizations")
    .select("id, name, status")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as OrganizationOption[];
}

async function loadUserOptions(admin: ReturnType<typeof createAdminClient>, profile: ProfileRow) {
  let query: any = admin
    .from("audit_logs")
    .select("actor_name, actor_email")
    .not("actor_email", "is", null)
    .order("created_at", { ascending: false })
    .limit(500);

  if (profile.role !== "super_admin" && profile.organization_id) {
    query = query.eq("organization_id", profile.organization_id);
  }

  const { data } = await query;
  const unique = new Map<string, UserOption>();

  for (const row of data ?? []) {
    const email = String((row as any).actor_email ?? "").trim();
    if (!email || unique.has(email)) continue;
    unique.set(email, {
      email,
      name: String((row as any).actor_name ?? "").trim(),
    });
  }

  return Array.from(unique.values()).sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email));
}

function LicenseChangeDetails({ metadata }: { metadata: Record<string, unknown> | null }) {
  if (!metadata) return null;

  const previous = isRecord(metadata.previous) ? metadata.previous : null;
  const current = isRecord(metadata.current) ? metadata.current : null;
  const delta = isRecord(metadata.delta) ? metadata.delta : null;

  if (!previous && !current && !delta) return null;

  const keys = Array.from(
    new Set([
      ...Object.keys(previous ?? {}),
      ...Object.keys(current ?? {}),
      ...Object.keys(delta ?? {}),
    ])
  );

  if (keys.length === 0) return null;

  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-amber-200 bg-amber-50/60">
      <table className="min-w-[560px] divide-y divide-amber-200 text-left text-xs">
        <thead className="bg-amber-100/70 text-amber-900">
          <tr>
            <th className="px-3 py-2 font-semibold">Licença</th>
            <th className="px-3 py-2 font-semibold">Antes</th>
            <th className="px-3 py-2 font-semibold">Depois</th>
            <th className="px-3 py-2 font-semibold">Variação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-amber-100 bg-white/70">
          {keys.map((key) => (
            <tr key={key}>
              <td className="px-3 py-2 font-medium text-slate-700">{licenseLabel(key)}</td>
              <td className="px-3 py-2 text-slate-600">{formatMetadataValue(previous?.[key])}</td>
              <td className="px-3 py-2 text-slate-600">{formatMetadataValue(current?.[key])}</td>
              <td className="px-3 py-2 font-semibold text-[#0F2D4A]">{formatMetadataValue(delta?.[key])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MetadataDetails({ log }: { log: AuditLogRow }) {
  const metadata = log.metadata ?? {};
  const visibleEntries = Object.entries(metadata).filter(
    ([key]) => !["previous", "current", "delta"].includes(key)
  );

  return (
    <details className="group">
      <summary className="inline-flex cursor-pointer list-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0F2A43] transition hover:border-[#B98A2E] hover:text-[#B98A2E]">
        Ver detalhes
      </summary>
      <div className="mt-3 w-[min(720px,80vw)] rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <div className="grid gap-3 text-xs sm:grid-cols-2">
          <div className="rounded-xl bg-white p-3">
            <p className="font-semibold text-slate-500">IP/origem</p>
            <p className="mt-1 break-words text-slate-800">{log.ip_address || "IP não informado"}</p>
          </div>
          <div className="rounded-xl bg-white p-3">
            <p className="font-semibold text-slate-500">Navegador/dispositivo</p>
            <p className="mt-1 break-words text-slate-800">{compactUserAgent(log.user_agent)}</p>
          </div>
        </div>

        {log.action === "license.updated" ? <LicenseChangeDetails metadata={metadata} /> : null}

        <div className="mt-4 rounded-xl bg-white p-3">
          <p className="text-xs font-semibold text-slate-500">Metadata formatado</p>
          {visibleEntries.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">Sem metadata adicional.</p>
          ) : (
            <dl className="mt-2 grid gap-2 text-xs">
              {visibleEntries.map(([key, value]) => (
                <div key={key} className="grid gap-1 rounded-lg border border-slate-100 p-2 sm:grid-cols-[180px_1fr]">
                  <dt className="font-semibold text-slate-500">{key}</dt>
                  <dd className="whitespace-pre-wrap break-words text-slate-800">{formatMetadataValue(value)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </details>
  );
}

export default async function AuditPage({ searchParams }: PageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters = readFilters(resolvedSearchParams);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, organization_id")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError || !profile) redirect("/login");

  const typedProfile = profile as ProfileRow;
  const admin = createAdminClient();
  const isSuperAdmin = typedProfile.role === "super_admin";
  const offset = (filters.page - 1) * filters.pageSize;
  const to = offset + filters.pageSize - 1;

  let logsQuery: any = admin
    .from("audit_logs")
    .select(
      "id, organization_id, organization_name, actor_name, actor_email, action, entity_type, entity_id, description, metadata, ip_address, user_agent, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  logsQuery = applyAuditFilters(logsQuery, filters, typedProfile).range(offset, to);

  const [organizations, userOptions, logsResult] = await Promise.all([
    loadOrganizations(admin, isSuperAdmin),
    loadUserOptions(admin, typedProfile),
    logsQuery,
  ]);

  const logs = ((logsResult.data ?? []) as AuditLogRow[]);
  const count = logsResult.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / filters.pageSize));
  const safeCurrentPage = Math.min(filters.page, totalPages);
  const startItem = count === 0 ? 0 : offset + 1;
  const endItem = Math.min(offset + logs.length, count);
  const exportHref = buildExportHref(filters);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
          Auditoria avançada
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#0F2A43]">
          Eventos do Lifenergy Digital
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Consulte eventos críticos com filtros por empresa, usuário, tipo de ação, entidade, período e busca textual.
        </p>
      </header>

      {logsResult.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Não foi possível carregar a auditoria: {logsResult.error.message}
        </div>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <form className="grid gap-4 lg:grid-cols-6" method="GET">
          {isSuperAdmin ? (
            <label className="block lg:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Empresa</span>
              <select
                name="organization_id"
                defaultValue={filters.organizationId}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B98A2E] focus:ring-2 focus:ring-[#B98A2E]/20"
              >
                <option value="">Todas as empresas</option>
                {organizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Usuário</span>
            <input
              name="user"
              defaultValue={filters.user}
              list="audit-user-options"
              placeholder="Nome ou e-mail"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B98A2E] focus:ring-2 focus:ring-[#B98A2E]/20"
            />
            <datalist id="audit-user-options">
              {userOptions.map((option) => (
                <option key={option.email} value={option.email}>{option.name ? `${option.name} · ${option.email}` : option.email}</option>
              ))}
            </datalist>
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Tipo de ação</span>
            <select
              name="action"
              defaultValue={filters.action}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B98A2E] focus:ring-2 focus:ring-[#B98A2E]/20"
            >
              <option value="">Todas as ações</option>
              {actionOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Período inicial</span>
            <input
              name="start_date"
              type="date"
              defaultValue={filters.startDate}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B98A2E] focus:ring-2 focus:ring-[#B98A2E]/20"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Período final</span>
            <input
              name="end_date"
              type="date"
              defaultValue={filters.endDate}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B98A2E] focus:ring-2 focus:ring-[#B98A2E]/20"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Entidade</span>
            <input
              name="entity"
              defaultValue={filters.entity}
              placeholder="organization, journey, report..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B98A2E] focus:ring-2 focus:ring-[#B98A2E]/20"
            />
          </label>

          <label className="block lg:col-span-4">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Busca textual</span>
            <input
              name="q"
              defaultValue={filters.q}
              placeholder="Descrição, e-mail do usuário, nome da empresa ou ação"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B98A2E] focus:ring-2 focus:ring-[#B98A2E]/20"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Registros por página</span>
            <select
              name="page_size"
              defaultValue={String(filters.pageSize)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#B98A2E] focus:ring-2 focus:ring-[#B98A2E]/20"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-3 lg:col-span-6 sm:flex-row">
            <button className="rounded-xl bg-[#0F2A43] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
              Aplicar filtros
            </button>
            <Link href="/painel/auditoria" className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Limpar filtros
            </Link>
            <Link href={exportHref} className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-center text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">
              Exportar CSV filtrado
            </Link>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0F2A43]">Registros de auditoria</h2>
            <p className="mt-1 text-sm text-slate-500">
              {count === 0
                ? "Nenhum evento encontrado com os filtros aplicados."
                : `Exibindo ${startItem}-${endItem} de ${count} evento${count === 1 ? "" : "s"}.`}
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Página {safeCurrentPage} de {totalPages}
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="px-6 py-10 text-sm text-slate-500">
            Nenhum evento de auditoria encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Data/hora</th>
                  <th className="px-5 py-3 font-semibold">Ação</th>
                  <th className="px-5 py-3 font-semibold">Usuário</th>
                  <th className="px-5 py-3 font-semibold">Empresa</th>
                  <th className="px-5 py-3 font-semibold">Entidade</th>
                  <th className="px-5 py-3 font-semibold">IP/origem</th>
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
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getBadgeClasses(log.action)}`}>
                        {actionLabels[log.action] ?? log.action}
                      </span>
                      <p className="mt-1 text-xs text-slate-400">{log.action}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <p className="font-medium text-slate-700">{log.actor_name || "Sistema"}</p>
                      <p className="mt-1 break-all text-xs text-slate-400">{log.actor_email || "-"}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{log.organization_name || "-"}</td>
                    <td className="px-5 py-4 text-slate-600">
                      <p>{log.entity_type || "-"}</p>
                      <p className="mt-1 max-w-[180px] truncate text-xs text-slate-400">
                        {log.entity_id || "-"}
                      </p>
                    </td>
                    <td className="max-w-[200px] px-5 py-4 text-xs text-slate-500">
                      <p className="font-semibold text-slate-700">{log.ip_address || "IP não informado"}</p>
                      <p className="mt-1 line-clamp-2 break-words">{compactUserAgent(log.user_agent)}</p>
                    </td>
                    <td className="max-w-[280px] px-5 py-4 leading-6 text-slate-600">
                      {log.description || "-"}
                    </td>
                    <td className="px-5 py-4">
                      <MetadataDetails log={log} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {count === 0 ? "Sem registros para paginar." : `Mostrando ${startItem}-${endItem} de ${count}.`}
          </p>
          <div className="flex gap-2">
            {safeCurrentPage > 1 ? (
              <Link href={buildPageHref(filters, safeCurrentPage - 1)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Anterior
              </Link>
            ) : (
              <span className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-300">Anterior</span>
            )}
            {safeCurrentPage < totalPages ? (
              <Link href={buildPageHref(filters, safeCurrentPage + 1)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Próxima
              </Link>
            ) : (
              <span className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-300">Próxima</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
