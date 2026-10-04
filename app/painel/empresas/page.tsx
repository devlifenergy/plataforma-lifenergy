import { CompanyCreateForm } from "@/components/application/CompanyCreateForm";
import {
  listCompanies,
  toggleCompanyStatus,
  updateCompany,
} from "@/services/companies/actions";

type Company = Awaited<ReturnType<typeof listCompanies>>[number];

type LicenseMetric = {
  label: string;
  shortLabel: string;
  contracted: number | null | undefined;
  used: number;
};

function numberOrZero(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatQuantity(value: number | null | undefined) {
  if (value === null || value === undefined) return "Ilimitado";
  return String(value);
}

function availableQuantity(contracted: number | null | undefined, used: number) {
  if (contracted === null || contracted === undefined) return null;
  return Math.max(numberOrZero(contracted) - numberOrZero(used), 0);
}

function usagePercentage(contracted: number | null | undefined, used: number) {
  const total = numberOrZero(contracted);
  if (total <= 0) return used > 0 ? 100 : 0;
  return Math.min(100, Math.round((numberOrZero(used) / total) * 100));
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Não informado";

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeZone: "America/Sao_Paulo",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function buildLicenseMetrics(company: Company): LicenseMetric[] {
  return [
    {
      label: "Relatório Individual",
      shortLabel: "Relatórios",
      contracted: company.licenseIndividualReports,
      used: company.usedIndividualReports ?? 0,
    },
    {
      label: "PDI Relacional",
      shortLabel: "PDI Relacional",
      contracted: company.licensePdiRelational,
      used: company.usedPdiRelational ?? 0,
    },
    {
      label: "PDI Corporativo",
      shortLabel: "PDI Corporativo",
      contracted: company.licensePdiCorporate,
      used: company.usedPdiCorporate ?? 0,
    },
  ];
}

function StatusBadge({ status }: { status: Company["status"] }) {
  const isActive = status === "active";

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-200 text-slate-600"
      }`}
    >
      {isActive ? "Ativa" : "Inativa"}
    </span>
  );
}

function LicenseUsageCard({ metric }: { metric: LicenseMetric }) {
  const available = availableQuantity(metric.contracted, metric.used);
  const percent = usagePercentage(metric.contracted, metric.used);
  const isExhausted = available !== null && available <= 0;
  const isLow = available !== null && available > 0 && numberOrZero(metric.contracted) > 0 && available <= 2;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#0F2D4A]">{metric.label}</p>
          <p className="mt-1 text-xs text-slate-500">Gestão do saldo de licenças</p>
        </div>
        {isExhausted ? (
          <span className="shrink-0 rounded-full bg-red-100 px-2 py-1 text-[11px] font-semibold text-red-700">
            Esgotada
          </span>
        ) : isLow ? (
          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-700">
            Baixa
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">
            OK
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-white px-2 py-3 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Contratadas</p>
          <p className="mt-1 text-lg font-bold text-[#0F2D4A]">{formatQuantity(metric.contracted)}</p>
        </div>
        <div className="rounded-xl bg-white px-2 py-3 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Usadas</p>
          <p className="mt-1 text-lg font-bold text-[#0F2D4A]">{metric.used}</p>
        </div>
        <div className="rounded-xl bg-white px-2 py-3 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Saldo</p>
          <p className={`mt-1 text-lg font-bold ${isExhausted ? "text-red-700" : "text-emerald-700"}`}>
            {available === null ? "Ilimitado" : available}
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${isExhausted ? "bg-red-500" : isLow ? "bg-amber-500" : "bg-emerald-500"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">{percent}% consumido no ciclo atual.</p>
    </div>
  );
}

function CompanyStats({ companies }: { companies: Company[] }) {
  const activeCompanies = companies.filter((company) => company.status === "active").length;
  const inactiveCompanies = companies.length - activeCompanies;
  const allMetrics = companies.flatMap(buildLicenseMetrics);
  const totalContracted = allMetrics.reduce((sum, metric) => sum + numberOrZero(metric.contracted), 0);
  const totalUsed = allMetrics.reduce((sum, metric) => sum + numberOrZero(metric.used), 0);
  const totalAvailable = Math.max(totalContracted - totalUsed, 0);

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Empresas</p>
        <p className="mt-2 text-2xl font-bold text-[#0F2D4A]">{companies.length}</p>
      </div>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Ativas</p>
        <p className="mt-2 text-2xl font-bold text-emerald-800">{activeCompanies}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Inativas</p>
        <p className="mt-2 text-2xl font-bold text-[#0F2D4A]">{inactiveCompanies}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Usadas</p>
        <p className="mt-2 text-2xl font-bold text-[#0F2D4A]">{totalUsed}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Saldo total</p>
        <p className="mt-2 text-2xl font-bold text-emerald-700">{totalAvailable}</p>
      </div>
    </section>
  );
}

function CompanyEditDetails({ company }: { company: Company }) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-white">
      <summary className="flex cursor-pointer list-none flex-col gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-[#0F2D4A] transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
        <span>Editar dados e licenças</span>
        <span className="inline-flex w-full justify-center rounded-xl bg-[#0F2D4A] px-4 py-2 text-xs font-semibold text-white group-open:hidden sm:w-auto">
          Abrir edição
        </span>
        <span className="hidden w-full justify-center rounded-xl bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 group-open:inline-flex sm:w-auto">
          Fechar edição
        </span>
      </summary>

      <div className="border-t border-slate-200 bg-slate-50 p-4">
        {company.profileId && company.authUserId ? (
          <form action={updateCompany} className="space-y-4">
            <input type="hidden" name="company_id" value={company.id} />
            <input type="hidden" name="profile_id" value={company.profileId} />
            <input type="hidden" name="auth_user_id" value={company.authUserId} />

            <div className="grid gap-4 lg:grid-cols-3">
              <label className="text-sm font-medium text-slate-700">
                Nome da empresa
                <input
                  name="company_name"
                  required
                  defaultValue={company.name}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-[#0F2D4A]"
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Nome do administrador
                <input
                  name="admin_name"
                  required
                  defaultValue={company.adminName}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-[#0F2D4A]"
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                E-mail do administrador
                <input
                  name="admin_email"
                  required
                  type="email"
                  defaultValue={company.adminEmail}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-[#0F2D4A]"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-bold text-[#0F2D4A]">Licenças contratadas</p>
              <p className="mt-1 text-xs text-slate-500">
                Ajuste o total contratado. O saldo exibido no card considera as licenças já usadas no ciclo atual.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <label className="text-sm font-medium text-slate-700">
                  Relatório Individual
                  <input
                    name="license_individual_reports"
                    type="number"
                    min="0"
                    required
                    defaultValue={company.licenseIndividualReports ?? 0}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-[#0F2D4A]"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  PDI Relacional
                  <input
                    name="license_pdi_relational"
                    type="number"
                    min="0"
                    required
                    defaultValue={company.licensePdiRelational ?? 0}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-[#0F2D4A]"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  PDI Corporativo
                  <input
                    name="license_pdi_corporate"
                    type="number"
                    min="0"
                    required
                    defaultValue={company.licensePdiCorporate ?? 0}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-[#0F2D4A]"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  name="notify_license_addition"
                  type="checkbox"
                  className="mt-1 h-5 w-5 rounded border-amber-300 text-[#0F2D4A]"
                />
                <span>
                  <strong className="block text-sm text-[#0F2D4A]">
                    Enviar e-mail sobre novas licenças ao salvar
                  </strong>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">
                    Use esta opção quando houver aumento no saldo contratado. O administrador da empresa será avisado por e-mail sobre as novas licenças adicionadas.
                  </span>
                </span>
              </label>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <label className="text-sm font-medium text-slate-700">
                Nova senha
                <input
                  name="new_password"
                  type="password"
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Deixe em branco para manter a senha atual"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-[#0F2D4A]"
                />
                <span className="mt-1 block text-xs text-slate-500">Mínimo de 6 caracteres.</span>
              </label>

              <button className="w-full rounded-xl bg-[#0F2D4A] px-6 py-3 font-semibold text-white transition hover:opacity-90 lg:w-auto">
                Salvar alterações
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-amber-700">
            Esta empresa não possui um administrador vinculado e não pode ser editada nesta tela.
          </p>
        )}
      </div>
    </details>
  );
}

function CompanyCard({ company }: { company: Company }) {
  const metrics = buildLicenseMetrics(company);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <h3 className="break-words text-xl font-bold text-[#0F2D4A]">{company.name}</h3>
              <StatusBadge status={company.status} />
            </div>
            <p className="break-words text-sm text-slate-600">
              <span className="font-semibold text-slate-700">Administrador:</span>{" "}
              {company.adminName || "Não informado"}
            </p>
            <p className="break-all text-sm text-slate-600">
              <span className="font-semibold text-slate-700">E-mail:</span>{" "}
              {company.adminEmail || "Não informado"}
            </p>
            <p className="text-xs text-slate-500">
              Ciclo de licenças desde: {formatDate(company.licensesStartedAt)}
            </p>
          </div>

          <form action={toggleCompanyStatus.bind(null, company.id, company.status)} className="w-full lg:w-auto">
            <button
              className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition lg:w-auto ${
                company.status === "active"
                  ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              {company.status === "active" ? "Inativar empresa" : "Ativar empresa"}
            </button>
          </form>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {metrics.map((metric) => (
            <LicenseUsageCard key={metric.label} metric={metric} />
          ))}
        </div>

        <CompanyEditDetails company={company} />
      </div>
    </article>
  );
}

export default async function EmpresasPage() {
  const companies = await listCompanies();

  return (
    <div className="max-w-full space-y-6 overflow-x-hidden">
      <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
          Superusuário
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#0F2D4A]">Empresas</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Gerencie empresas, administradores e licenças com visão clara de contratadas, usadas e disponíveis.
        </p>
      </header>

      <CompanyStats companies={companies} />

      <details className="group rounded-3xl border border-slate-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none flex-col gap-3 px-5 py-4 text-lg font-semibold text-[#0F2D4A] transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>Cadastrar nova empresa</span>
          <span className="inline-flex w-full justify-center rounded-xl bg-[#0F2D4A] px-4 py-2 text-xs font-semibold text-white group-open:hidden sm:w-auto">
            Abrir cadastro
          </span>
          <span className="hidden w-full justify-center rounded-xl bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 group-open:inline-flex sm:w-auto">
            Fechar cadastro
          </span>
        </summary>
        <div className="border-t border-slate-200 p-4 sm:p-6">
          <CompanyCreateForm />
        </div>
      </details>

      <section className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0F2D4A]">Empresas cadastradas</h2>
          <p className="mt-1 text-sm text-slate-500">
            {companies.length === 0
              ? "Nenhuma empresa cadastrada."
              : `${companies.length} empresa${companies.length === 1 ? "" : "s"} encontrada${companies.length === 1 ? "" : "s"}.`}
          </p>
        </div>

        {companies.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
            Nenhuma empresa cadastrada.
          </div>
        ) : (
          <div className="grid gap-4">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
