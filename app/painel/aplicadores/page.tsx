import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  createApplicator,
  listApplicators,
  toggleApplicatorStatus,
  updateApplicator,
} from "@/services/applicators/actions";

export default async function AplicadoresPage() {
  const applicators = await listApplicators();
  const total = applicators.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0F2D4A]">
          Cadastro de Aplicadores
        </h1>
        <p className="mt-1 text-slate-500">
          {total === 1
            ? "1 aplicador cadastrado"
            : `${total} aplicadores cadastrados`}
        </p>
      </div>

      <Card>
        <form action={createApplicator} className="grid gap-4 md:grid-cols-4">
          <Input name="name" label="Nome *" required />
          <Input name="email" label="E-mail" type="email" />
          <Input name="phone" label="Telefone" />

          <div className="flex items-end">
            <Button type="submit" className="w-full">
              + Novo Aplicador
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        {applicators.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-xl font-semibold text-[#0F2D4A]">
              Nenhum aplicador cadastrado
            </h2>
            <p className="mt-2 text-slate-500">
              Cadastre o primeiro aplicador acima.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b text-sm text-slate-500">
                  <th className="py-3 pr-4">Nome</th>
                  <th className="py-3 pr-4">E-mail</th>
                  <th className="py-3 pr-4">Telefone</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3">Ações</th>
                </tr>
              </thead>

              <tbody>
                {applicators.map((item) => (
                  <tr key={item.id} className="border-b align-top last:border-0">
                    <td className="py-4 pr-4 font-medium">{item.name}</td>

                    <td className="py-4 pr-4 text-slate-600">
                      {item.email || "-"}
                    </td>

                    <td className="py-4 pr-4 text-slate-600">
                      {item.phone || "-"}
                    </td>

                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {item.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>

                    <td className="py-4">
                      <div className="flex items-start gap-4">
                        <details>
                          <summary className="cursor-pointer list-none font-semibold text-[#0F2D4A] underline">
                            Editar
                          </summary>

                          <div className="mt-4 w-[420px] max-w-[80vw] rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                            <form action={updateApplicator} className="space-y-3">
                              <input
                                type="hidden"
                                name="applicator_id"
                                value={item.id}
                              />

                              <Input
                                name="name"
                                label="Nome *"
                                defaultValue={item.name}
                                required
                              />

                              <Input
                                name="email"
                                label="E-mail"
                                type="email"
                                defaultValue={item.email || ""}
                              />

                              <Input
                                name="phone"
                                label="Telefone"
                                defaultValue={item.phone || ""}
                              />

                              <Button type="submit" className="w-full">
                                Salvar alterações
                              </Button>
                            </form>
                          </div>
                        </details>

                        <form
                          action={toggleApplicatorStatus.bind(
                            null,
                            item.id,
                            item.active
                          )}
                        >
                          <button
                            type="submit"
                            className="font-semibold text-[#0F2D4A] underline"
                          >
                            {item.active ? "Inativar" : "Ativar"}
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
      </Card>
    </div>
  );
}
