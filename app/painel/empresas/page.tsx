import { CompanyCreateForm } from "@/components/application/CompanyCreateForm";
import {
  listCompanies,
  toggleCompanyStatus,
  updateCompany,
} from "@/services/companies/actions";

type Company = Awaited<ReturnType<typeof listCompanies>>[number];

function formatLicense(value: number | null | undefined) {
  if (value === null || value === undefined) return "Ilimitado";
  return String(value);
}

function numberOrZero(value: number | null | undefined) {
  return typeof value === "number" ? value : 0;
}

function StatusBadge({ status }: { status: Company["status"] }) {
  const isActive = status === "active";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-200 text-slate-600"
      }`}
    >
      {isActive ? "Ativa" : "Inativa"}
    </span>
  );
}

function LicensePill({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-[#0F2D4A]">{formatLicense(value)}</p>
    </div>
  );
}

function CompanyStats({ companies }: { companies: Company[] }) {
  const activeCompanies = companies.filter((company) => company.status === "active").length;
  const inactiveCompanies = companies.length - activeCompanies;
  const totalIndividual = companies.reduce(
    (sum, company) => sum + numberOrZero(company.licenseIndividualReports),
    0
  );
  const totalRelational = companies.reduce(
    (sum, company) => sum + numberOrZero(company.licensePdiRelational),
    0
  );
  const totalCorporate = companies.reduce(
    (sum, company) => sum + numberOrZero(company.licensePdiCorporate),
    0
  );

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
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Relatórios</p>
        <p className="mt-2 text-2xl font-bold text-[#0F2D4A]">{totalIndividual}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">PDIs</p>
        <p className="mt-2 text-2xl font-bold text-[#0F2D4A]">{totalRelational + totalCorporate}</p>
      </div>
    </section>
  );
}

function CompanyEditDetails({ company }: { company: Company }) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-[#0F2D4A] transition hover:bg-slate-50">
        <span>Editar empresa</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 group-open:hidden">
          Abrir
        </span>
        <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 group-open:inline-flex">
          Fechar
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

            <div className="grid gap-4 sm:grid-cols-3">
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

              <button className="rounded-xl bg-[#0F2D4A] px-6 py-3 font-semibold text-white transition hover:opacity-90">
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
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] xl:items-start">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="break-words text-xl font-bold text-[#0F2D4A]">{company.name}</h3>
              <p className="mt-2 break-words text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Administrador:</span>{" "}
                {company.adminName || "Não informado"}
              </p>
              <p className="mt-1 break-all text-sm text-slate-600">
                <span className="font-semibold text-slate-700">E-mail:</span>{" "}
                {company.adminEmail || "Não informado"}
              </p>
            </div>
            <StatusBadge status={company.status} />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <LicensePill label="Rel. Individual" value={company.licenseIndividualReports} />
            <LicensePill label="PDI Relacional" value={company.licensePdiRelational} />
            <LicensePill label="PDI Corporativo" value={company.licensePdiCorporate} />
          </div>
        </div>

        <div className="space-y-3">
          <CompanyEditDetails company={company} />

          <form action={toggleCompanyStatus.bind(null, company.id, company.status)}>
            <button
              className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                company.status === "active"
                  ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              {company.status === "active" ? "Inativar empresa" : "Ativar empresa"}
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}

export default async function EmpresasPage() {
  const companies = await listCompanies();

  return (
    <div className="max-w-full space-y-6 overflow-x-hidden">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#B98A2E]">
          Superusuário
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#0F2D4A]">Empresas</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Cadastre empresas clientes, gerencie administradores, status e saldos de licenças em uma tela sem rolagem horizontal.
        </p>
      </header>

      <CompanyStats companies={companies} />

      <details className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-lg font-semibold text-[#0F2D4A] transition hover:bg-slate-50 sm:px-6">
          <span>Cadastrar nova empresa</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 group-open:hidden">
            Abrir formulário
          </span>
        </summary>
        <div className="border-t border-slate-200 p-4 sm:p-6">
          <CompanyCreateForm />
        </div>
      </details>

      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#0F2D4A]">Empresas cadastradas</h2>
            <p className="mt-1 text-sm text-slate-500">
              {companies.length === 0
                ? "Nenhuma empresa cadastrada."
                : `${companies.length} empresa${companies.length === 1 ? "" : "s"} encontrada${companies.length === 1 ? "" : "s"}.`}
            </p>
          </div>
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
