import { CopyLinkButton } from "@/components/application/CopyLinkButton";
import { CreateJourneyForm } from "@/components/application/CreateJourneyForm";
import { DeletePendingJourneyButton } from "@/components/application/DeletePendingJourneyButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
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

function normalizeCpf(value: string | null) {
  return String(value ?? "").replace(/\D/g, "");
}

function formatCpf(value: string | null) {
  const digits = normalizeCpf(value);
  if (digits.length !== 11) return "CPF ainda não informado";
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export default async function EntrevistadosPage() {
  const [journeys, applicators] = await Promise.all([
    listJourneys(),
    listActiveApplicators(),
  ]);

  const groups = new Map<string, typeof journeys>();
  const PENDING_CPF_GROUP_KEY = "__cpf_pending__";

  for (const journey of journeys) {
    const normalizedCpf = normalizeCpf(journey.cpf);
    const groupKey = normalizedCpf || PENDING_CPF_GROUP_KEY;
    const current = groups.get(groupKey) ?? [];
    current.push(journey);
    groups.set(groupKey, current);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0F2D4A]">Avaliados</h1>
        <p className="mt-1 text-slate-500">
          {journeys.length === 1
            ? "1 convite cadastrado"
            : `${journeys.length} convites cadastrados`}
        </p>
      </div>

      <Card>
        <CreateJourneyForm applicators={applicators} />
      </Card>

      {journeys.length === 0 ? (
        <Card>
          <div className="py-20 text-center">
            <h2 className="text-xl font-semibold text-[#0F2D4A]">
              Nenhum avaliado convidado
            </h2>
            <p className="mt-2 text-slate-500">Crie o primeiro convite acima.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-5">
          {Array.from(groups.entries()).map(([groupKey, items]) => {
            const cpf = items[0]?.cpf ?? null;
            const isPendingCpfGroup = groupKey === PENDING_CPF_GROUP_KEY;

            return (
              <Card key={groupKey}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">
                      CPF
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-[#0F2D4A]">
                      {formatCpf(cpf)}
                    </h2>
                    {isPendingCpfGroup ? (
                      <p className="mt-1 text-[15px] leading-6 text-slate-500">
                        Links gerados e ainda não respondidos
                      </p>
                    ) : null}
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[15px] font-semibold leading-6 text-slate-600">
                    {items.length === 1 ? "1 link" : `${items.length} links`}
                  </span>
                </div>

                <div className="space-y-4">
                  {items.map((item) => {
                    const applicatorName =
                      (item as any).applicators?.name ??
                      (item as any).applicators?.[0]?.name;
                    const link = `/r/${item.token}`;

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200 p-5"
                      >
                        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_auto]">
                          <div>
                            <p className="text-[15px] font-semibold leading-6 text-slate-500">
                              {item.code}
                            </p>
                            <h3 className="mt-1 text-lg font-bold text-[#0F2D4A]">
                              {item.participant_name}
                            </h3>
                            <p className="mt-1 text-[15px] leading-6 text-slate-600">
                              Aplicador: {applicatorName || "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[15px] font-semibold leading-6 text-slate-500">
                              Atividade
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-[15px] leading-7 text-slate-700">
                              {item.activity || "-"}
                            </p>
                          </div>

                          <div className="flex flex-col items-start gap-3 lg:items-end">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-[13px] font-semibold leading-5 ${statusClasses(
                                item.status
                              )}`}
                            >
                              {statusLabel(item.status)}
                            </span>
                            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                              <a
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-[#0F2D4A] underline"
                              >
                                Abrir link
                              </a>
                              <CopyLinkButton path={link} />
                              {item.status === "created" || item.status === "link_sent" ? (
                                <DeletePendingJourneyButton journeyId={item.id} />
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 border-t border-slate-100 pt-4">
                          {item.status !== "completed" &&
                          item.status !== "exported" ? (
                            <details>
                              <summary className="cursor-pointer list-none font-semibold text-[#0F2D4A] underline">
                                Editar
                              </summary>

                              <div className="mt-4 max-w-2xl rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
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

                                  <label className="block">
                                    <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
                                      Atividade *
                                    </span>
                                    <textarea
                                      name="activity"
                                      required
                                      rows={4}
                                      defaultValue={item.activity || ""}
                                      className="min-h-28 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-base leading-7 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
                                    />
                                  </label>

                                  <Button type="submit" className="w-full">
                                    Salvar alterações
                                  </Button>
                                </form>
                              </div>
                            </details>
                          ) : (
                            <span className="text-[15px] font-medium leading-6 text-slate-400">
                              Edição bloqueada
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
