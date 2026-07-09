import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  createJourney,
  listActiveApplicators,
  listJourneys,
} from "@/services/journeys/actions";

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    created: "Criada",
    link_sent: "Convite enviado",
    in_progress: "Em andamento",
    completed: "Concluida",
    exported: "Exportada",
  };

  return labels[status] ?? status;
}

export default async function EntrevistadosPage() {
  const [journeys, applicators] = await Promise.all([
    listJourneys(),
    listActiveApplicators(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0F2D4A]">Entrevistados</h1>
        <p className="mt-1 text-slate-500">
          Convide entrevistados para responder a avaliacao Lifenergy.
        </p>
      </div>

      <Card>
        <form action={createJourney} className="grid gap-4 md:grid-cols-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Aplicador *
            </span>
            <select
              name="applicator_id"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
            >
              <option value="">Selecione</option>
              {applicators.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <Input name="participant_name" label="Nome do entrevistado *" required />

          <Input name="participant_email" label="E-mail" type="email" />

          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Criar Convite
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        {journeys.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-xl font-semibold text-[#0F2D4A]">
              Nenhum entrevistado convidado
            </h2>
            <p className="mt-2 text-slate-500">
              Crie o primeiro convite acima.
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b text-sm text-slate-500">
                <th className="py-3">Codigo</th>
                <th className="py-3">Entrevistado</th>
                <th className="py-3">Aplicador</th>
                <th className="py-3">Status</th>
                <th className="py-3">Link</th>
              </tr>
            </thead>

            <tbody>
              {journeys.map((item) => {
                const applicatorName = (item as any).applicators?.name ??
  		(item as any).applicators?.[0]?.name;

                const link = `/r/${item.token}`;

                return (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-4 font-medium">{item.code}</td>
                    <td className="py-4 text-slate-700">
                      {item.participant_name}
                    </td>
                    <td className="py-4 text-slate-600">
                      {applicatorName || "-"}
                    </td>
                    <td className="py-4 text-slate-600">
                      {statusLabel(item.status)}
                    </td>
                    <td className="py-4">
                      <a
                        href={link}
                        target="_blank"
                        className="font-semibold text-[#0F2D4A] underline"
                      >
                        Abrir link
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}