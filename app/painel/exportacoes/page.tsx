import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type ExportPreviewRow = {
  responseId: string;
  empresa: string;
  avaliado: string;
  email: string;
  cpf: string;
  dataAplicacao: string;
  status: string;
  aplicador: string;
  fractais: number;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function buildExportUrl(params: {
  organizationId: string;
  avaliado: string;
  startDate: string;
  endDate: string;
}) {
  const query = new URLSearchParams();

  if (params.organizationId) query.set("organization_id", params.organizationId);
  if (params.avaliado) query.set("avaliado", params.avaliado);
  if (params.startDate) query.set("start_date", params.startDate);
  if (params.endDate) query.set("end_date", params.endDate);

  const text = query.toString();
  return text ? `/api/exportacoes?${text}` : "/api/exportacoes";
}

function formatDate(value: unknown) {
  if (!value) return "-";
  const text = String(value);
  const match = text.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return text;
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

function labelStatus(value: unknown) {
  const labels: Record<string, string> = {
    created: "Criada",
    link_sent: "Convite enviado",
    in_progress: "Em andamento",
    completed: "Concluída",
    exported: "Exportada",
  };

  return labels[String(value ?? "")] ?? String(value ?? "-");
}

function applicatorNameFromJourney(journey: any) {
  const applicators = journey?.applicators;
  if (Array.isArray(applicators)) return applicators[0]?.name ?? "-";
  return applicators?.name ?? "-";
}

function organizationNameFromJourney(journey: any) {
  const organizations = journey?.organizations;
  if (Array.isArray(organizations)) return organizations[0]?.name ?? "-";
  return organizations?.name ?? "-";
}

async function loadPreviewRows(params: {
  admin: ReturnType<typeof createAdminClient>;
  organizationId: string;
  avaliado: string;
  startDate: string;
  endDate: string;
}): Promise<ExportPreviewRow[]> {
  let journeysQuery = params.admin
    .from("journeys")
    .select(
      "id, organization_id, code, token, status, activity, created_at, completed_at, applicators(name), organizations(name)"
    )
    .order("created_at", { ascending: false });

  if (params.organizationId) {
    journeysQuery = journeysQuery.eq("organization_id", params.organizationId);
  }

  const { data: journeys, error: journeysError } = await journeysQuery;

  if (journeysError) {
    throw new Error(journeysError.message);
  }

  const journeysById = new Map<string, any>();
  for (const journey of journeys ?? []) {
    journeysById.set(journey.id, journey);
  }

  const journeyIds = Array.from(journeysById.keys());
  if (journeyIds.length === 0) return [];

  let responsesQuery = params.admin
    .from("journey_responses")
    .select("id, journey_id, application_date, full_name, cpf, email, created_at")
    .in("journey_id", journeyIds)
    .order("created_at", { ascending: false })
    .limit(50);

  if (params.avaliado) {
    const safeSearch = params.avaliado.replace(/[%,]/g, "");
    responsesQuery = responsesQuery.or(
      `full_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%,cpf.ilike.%${safeSearch}%`
    );
  }

  if (params.startDate) {
    responsesQuery = responsesQuery.gte("application_date", params.startDate);
  }

  if (params.endDate) {
    responsesQuery = responsesQuery.lte("application_date", params.endDate);
  }

  const { data: responses, error: responsesError } = await responsesQuery;

  if (responsesError) {
    throw new Error(responsesError.message);
  }

  const responseIds = (responses ?? []).map((response) => response.id).filter(Boolean);
  const fractalCountByResponse = new Map<string, number>();

  if (responseIds.length > 0) {
    const { data: responseFractals } = await params.admin
      .from("journey_response_fractals")
      .select("journey_response_id, position")
      .in("journey_response_id", responseIds);

    const positionsByResponse = new Map<string, Set<number>>();
    for (const fractal of responseFractals ?? []) {
      const responseId = String(fractal.journey_response_id);
      const positions = positionsByResponse.get(responseId) ?? new Set<number>();
      positions.add(Number(fractal.position));
      positionsByResponse.set(responseId, positions);
    }

    for (const [responseId, positions] of positionsByResponse.entries()) {
      fractalCountByResponse.set(responseId, positions.size);
    }
  }

  return (responses ?? []).map((response) => {
    const journey = journeysById.get(response.journey_id) ?? {};

    return {
      responseId: response.id,
      empresa: organizationNameFromJourney(journey),
      avaliado: response.full_name || "-",
      email: response.email || "-",
      cpf: response.cpf || "-",
      dataAplicacao: formatDate(response.application_date),
      status: labelStatus(journey.status),
      aplicador: applicatorNameFromJourney(journey),
      fractais: fractalCountByResponse.get(response.id) || 1,
    };
  });
}

export default async function ExportacoesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError || profile?.role !== "super_admin") {
    redirect("/painel");
  }

  const admin = createAdminClient();
  const { data: organizations, error: organizationsError } = await admin
    .from("organizations")
    .select("id, name, status")
    .order("name", { ascending: true });

  if (organizationsError) {
    throw new Error(organizationsError.message);
  }

  const organizationId = firstValue(resolvedSearchParams.organization_id);
  const avaliado = firstValue(resolvedSearchParams.avaliado);
  const startDate = firstValue(resolvedSearchParams.start_date);
  const endDate = firstValue(resolvedSearchParams.end_date);
  const exportUrl = buildExportUrl({ organizationId, avaliado, startDate, endDate });
  const previewRows = await loadPreviewRows({
    admin,
    organizationId,
    avaliado,
    startDate,
    endDate,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0F2D4A]">Laudos e Exportações</h1>
        <p className="mt-1 text-slate-500">
          Área exclusiva do super usuário para exportar dados de avaliações com filtros por empresa, avaliado e período.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="grid gap-5 lg:grid-cols-4" method="GET">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Empresa
            </span>
            <select
              name="organization_id"
              defaultValue={organizationId}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
            >
              <option value="">Todas as empresas</option>
              {(organizations ?? []).map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Avaliado
            </span>
            <input
              name="avaliado"
              defaultValue={avaliado}
              placeholder="Nome, e-mail ou CPF"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Data inicial
            </span>
            <input
              name="start_date"
              type="date"
              defaultValue={startDate}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Data final
            </span>
            <input
              name="end_date"
              type="date"
              defaultValue={endDate}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
            />
          </label>

          <div className="flex flex-wrap gap-3 lg:col-span-4">
            <button
              type="submit"
              className="rounded-xl border border-[#0F2D4A] bg-white px-6 py-3 font-semibold text-[#0F2D4A] transition hover:bg-slate-50"
            >
              Aplicar filtros
            </button>
            <a
              href="/painel/exportacoes"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Limpar filtros
            </a>
            <a
              href={exportUrl}
              className="rounded-xl bg-[#0F2D4A] px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Exportar arquivo para Excel
            </a>
          </div>
        </form>

        <p className="mt-5 text-sm leading-6 text-slate-500">
          O período considera a data da aplicação registrada na avaliação. Quando nenhum filtro for informado, o arquivo exportará todas as avaliações concluídas disponíveis no Sandbox.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#0F2D4A]">
              Preview dos dados que serão baixados
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Exibindo até 50 registros conforme os filtros selecionados.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
            {previewRows.length} registro{previewRows.length === 1 ? "" : "s"}
          </span>
        </div>

        {previewRows.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            Nenhum registro encontrado para os filtros selecionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-6 py-3">Empresa</th>
                  <th className="px-6 py-3">Avaliado</th>
                  <th className="px-6 py-3">E-mail</th>
                  <th className="px-6 py-3">CPF</th>
                  <th className="px-6 py-3">Data</th>
                  <th className="px-6 py-3">Aplicador</th>
                  <th className="px-6 py-3">Fractais</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row) => (
                  <tr key={row.responseId} className="border-b border-slate-100 last:border-0">
                    <td className="px-6 py-4 font-medium text-slate-900">{row.empresa}</td>
                    <td className="px-6 py-4 text-slate-700">{row.avaliado}</td>
                    <td className="px-6 py-4 text-slate-700">{row.email}</td>
                    <td className="px-6 py-4 text-slate-700">{row.cpf}</td>
                    <td className="px-6 py-4 text-slate-700">{row.dataAplicacao}</td>
                    <td className="px-6 py-4 text-slate-700">{row.aplicador}</td>
                    <td className="px-6 py-4 text-slate-700">{row.fractais}</td>
                    <td className="px-6 py-4 text-slate-700">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
