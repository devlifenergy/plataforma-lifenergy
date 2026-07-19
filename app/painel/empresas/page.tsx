import {
  createCompany,
  listCompanies,
  toggleCompanyStatus,
  updateCompany,
} from "@/services/companies/actions";

export default async function EmpresasPage() {
  const companies = await listCompanies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0F2D4A]">Empresas</h1>
        <p className="mt-1 text-slate-500">
          Cadastre empresas clientes e seus usuários administradores.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#0F2D4A]">
          Cadastrar empresa
        </h2>

        <form action={createCompany} className="grid gap-4 md:grid-cols-2">
          <input
            name="company_name"
            required
            placeholder="Nome da empresa *"
            className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A]"
          />

          <input
            name="admin_name"
            required
            placeholder="Nome do administrador *"
            className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A]"
          />

          <input
            name="admin_email"
            required
            type="email"
            placeholder="E-mail do administrador *"
            className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A]"
          />

          <input
            name="password"
            required
            type="password"
            placeholder="Senha inicial *"
            className="rounded-xl border border-slate-300 p-3 outline-none transition focus:border-[#0F2D4A]"
          />

          <button className="rounded-xl bg-[#0F2D4A] px-6 py-4 font-semibold text-white transition hover:opacity-90 md:col-span-2">
            Cadastrar Empresa
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#0F2D4A]">
            Empresas cadastradas
          </h2>
        </div>

        {companies.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            Nenhuma empresa cadastrada.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-500">
                  <th className="px-6 py-3">Empresa</th>
                  <th className="px-6 py-3">Administrador</th>
                  <th className="px-6 py-3">E-mail</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Ações</th>
                </tr>
              </thead>

              <tbody>
                {companies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-slate-100 align-top last:border-0"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {company.name}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {company.adminName || "Não informado"}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {company.adminEmail || "Não informado"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          company.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {company.status === "active" ? "Ativa" : "Inativa"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-start gap-4">
                        <details className="group">
                          <summary className="cursor-pointer list-none font-semibold text-[#0F2D4A] underline">
                            Editar
                          </summary>

                          <div className="mt-4 w-[420px] max-w-[80vw] rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                            {company.profileId && company.authUserId ? (
                              <form action={updateCompany} className="space-y-3">
                                <input type="hidden" name="company_id" value={company.id} />
                                <input type="hidden" name="profile_id" value={company.profileId} />
                                <input type="hidden" name="auth_user_id" value={company.authUserId} />

                                <div>
                                  <label htmlFor={`company_name_${company.id}`} className="mb-1 block text-sm font-medium text-slate-700">
                                    Nome da empresa
                                  </label>
                                  <input
                                    id={`company_name_${company.id}`}
                                    name="company_name"
                                    required
                                    defaultValue={company.name}
                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-[#0F2D4A]"
                                  />
                                </div>

                                <div>
                                  <label htmlFor={`admin_name_${company.id}`} className="mb-1 block text-sm font-medium text-slate-700">
                                    Nome do administrador
                                  </label>
                                  <input
                                    id={`admin_name_${company.id}`}
                                    name="admin_name"
                                    required
                                    defaultValue={company.adminName}
                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-[#0F2D4A]"
                                  />
                                </div>

                                <div>
                                  <label htmlFor={`admin_email_${company.id}`} className="mb-1 block text-sm font-medium text-slate-700">
                                    E-mail do administrador
                                  </label>
                                  <input
                                    id={`admin_email_${company.id}`}
                                    name="admin_email"
                                    required
                                    type="email"
                                    defaultValue={company.adminEmail}
                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-[#0F2D4A]"
                                  />
                                </div>

                                <div>
                                  <label htmlFor={`new_password_${company.id}`} className="mb-1 block text-sm font-medium text-slate-700">
                                    Nova senha
                                  </label>
                                  <input
                                    id={`new_password_${company.id}`}
                                    name="new_password"
                                    type="password"
                                    minLength={6}
                                    autoComplete="new-password"
                                    placeholder="Deixe em branco para manter a senha atual"
                                    className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-[#0F2D4A]"
                                  />
                                  <p className="mt-1 text-xs text-slate-500">
                                    Mínimo de 6 caracteres.
                                  </p>
                                </div>

                                <button className="w-full rounded-xl bg-[#0F2D4A] px-5 py-3 font-semibold text-white transition hover:opacity-90">
                                  Salvar alterações
                                </button>
                              </form>
                            ) : (
                              <p className="text-sm text-amber-700">
                                Esta empresa não possui um administrador vinculado e não pode ser editada nesta tela.
                              </p>
                            )}
                          </div>
                        </details>

                        <form action={toggleCompanyStatus.bind(null, company.id, company.status)}>
                          <button className="font-semibold text-[#0F2D4A] underline">
                            {company.status === "active" ? "Inativar" : "Ativar"}
                          </button>
                        </form>
                      </div>
                    </td>
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
