import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { createApplicator, listApplicators } from "@/services/applicators/actions";

export default async function AplicadoresPage() {
  const applicators = await listApplicators();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0F2D4A]">Aplicadores</h1>
        <p className="mt-1 text-slate-500">
          {applicators.length} cadastrados
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
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b text-sm text-slate-500">
                <th className="py-3">Nome</th>
                <th className="py-3">E-mail</th>
                <th className="py-3">Telefone</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applicators.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-4 font-medium">{item.name}</td>
                  <td className="py-4 text-slate-600">{item.email || "-"}</td>
                  <td className="py-4 text-slate-600">{item.phone || "-"}</td>
                  <td className="py-4">
                    {item.active ? "Ativo" : "Inativo"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}