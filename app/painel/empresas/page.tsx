import {
  createCompany,
  listCompanies,
  toggleCompanyStatus,
} from "@/services/companies/actions";

export default async function EmpresasPage() {
  const companies = await listCompanies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0F2D4A]">Empresas</h1>
        <p className="mt-1 text-slate-500">
          Cadastre empresas clientes e seus usuarios administradores.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form action={createCompany} className="grid gap-4 md:grid-cols-2">
          <input
            name="company_name"
            required
            placeholder="Nome da empresa *"
            className="rounded-xl border p-3"
          />

          <input
            name="admin_name"
            required
            placeholder="Nome do administrador *"
            className="rounded-xl border p-3"
          />

          <input
            name="admin_email"
            required
            type="email"
            placeholder="E-mail do administrador *"
            className="rounded-xl border p-3"
          />

          <input
            name="password"
            required
            type="password"
            placeholder="Senha inicial *"
            className="rounded-xl border p-3"
          />

          <button className="rounded-xl bg-[#0F2D4A] px-6 py-4 font-semibold text-white md:col-span-2">
            Cadastrar Empresa
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {companies.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            Nenhuma empresa cadastrada.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-slate-500">
                <th className="py-3">Empresa</th>
                <th className="py-3">Status</th>
                <th className="py-3">Acoes</th>
              </tr>
            </thead>

            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b last:border-0">
                  <td className="py-4 font-medium">{company.name}</td>
                  <td className="py-4">
                    {company.status === "active" ? "Ativa" : "Inativa"}
                  </td>
                  <td className="py-4">
                    <form
                      action={toggleCompanyStatus.bind(
                        null,
                        company.id,
                        company.status
                      )}
                    >
                      <button className="font-semibold text-[#0F2D4A] underline">
                        {company.status === "active" ? "Inativar" : "Ativar"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
