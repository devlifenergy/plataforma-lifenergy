import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
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
    </div>
  );
}
