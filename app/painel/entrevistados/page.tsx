import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  createJourney,
  listActiveApplicators,
  listJourneys,
  updateJourneyParticipant,
} from "@/services/journeys/actions";

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    created: "Criada",
    link_sent: "Convite enviado",
    in_progress: "Em andamento",
    completed: "Concluída",
    exported: "Exportada",
  };

  return labels[status] ?? status;
}

function statusClasses(status: string) {
  const classes: Record<string, string> = {
    created: "bg-slate-100 text-slate-700",
    link_sent: "bg-blue-100 text-blue-700",
    in_progress: "bg-amber-100 text-amber-700",
    completed: "bg-emerald-100 text-emerald-700",
    exported: "bg-violet-100 text-violet-700",
  };

  return classes[status] ?? "bg-slate-100 text-slate-700";
}

export default async function EntrevistadosPage() {
  const [journeys, applicators] = await Promise.all([
    listJourneys(),
    listActiveApplicators(),
  ]);

  const total = journeys.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0F2D4A]">Avaliados</h1>
        <p className="mt-1 text-slate-500">
          {total === 1
            ? "1 avaliado cadastrado"
            : `${total} avaliados cadastrados`}
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

          <Input name="participant_name" label="Nome do avaliado *" required />
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
              Nenhum avaliado convidado
            </h2>
            <p className="mt-2 text-slate-500">
              Crie o primeiro convite acima.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className="border-b text-sm text-slate-500">
                  <th className="py-3 pr-4">Código</th>
                  <th className="py-3 pr-4">Avaliado</th>
                  <th className="py-3 pr-4">E-mail</th>
                  <th className="py-3 pr-4">Aplicador</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3">Ações</th>
                </tr>
              </thead>

              <tbody>
                {journeys.map((item) => {
                  const applicatorName =
                    (item as any).applicators?.name ??
                    (item as any).applicators?.[0]?.name;

                  const link = `/r/${item.token}`;

                  return (
                    <tr
                      key={item.id}
                      className="border-b align-top last:border-0"
                    >
                      <td className="py-4 pr-4 font-medium">{item.code}</td>

                      <td className="py-4 pr-4 text-slate-700">
                        {item.participant_name}
                      </td>

                      <td className="py-4 pr-4 text-slate-600">
                        {item.participant_email || "-"}
                      </td>

                      <td className="py-4 pr-4 text-slate-600">
                        {applicatorName || "-"}
                      </td>

                      <td className="py-4 pr-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
                            item.status
                          )}`}
                        >
                          {statusLabel(item.status)}
                        </span>
                      </td>

                      <td className="py-4">
                        <div className="flex items-start gap-4">
                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-[#0F2D4A] underline"
                          >
                            Abrir link
                          </a>

                          {item.status !== "completed" &&
                          item.status !== "exported" ? (
                            <details>
                              <summary className="cursor-pointer list-none font-semibold text-[#0F2D4A] underline">
                                Editar
                              </summary>

                              <div className="mt-4 w-[420px] max-w-[80vw] rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                                <form
                                  action={updateJourneyParticipant}
                                  className="space-y-3"
                                >
                                  <input
                                    type="hidden"
                                    name="journey_id"
                                    value={item.id}
                                  />

                                  <Input
                                    name="participant_name"
                                    label="Nome do avaliado *"
                                    defaultValue={item.participant_name}
                                    required
                                  />

                                  <Input
                                    name="participant_email"
                                    label="E-mail"
                                    type="email"
                                    defaultValue={item.participant_email || ""}
                                  />

                                  <Button type="submit" className="w-full">
                                    Salvar alterações
                                  </Button>
                                </form>
                              </div>
                            </details>
                          ) : (
                            <span className="text-sm font-medium text-slate-400">
                              Edição bloqueada
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
