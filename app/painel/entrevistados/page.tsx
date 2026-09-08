import { CopyLinkButton } from "@/components/application/CopyLinkButton";
import { CreateJourneyForm } from "@/components/application/CreateJourneyForm";
import { EditJourneyForm } from "@/components/application/EditJourneyForm";
import { DeletePendingJourneyButton } from "@/components/application/DeletePendingJourneyButton";
import { GenerateReportButton } from "@/components/application/GenerateReportButton";
import { SendJourneyLinkEmailButton } from "@/components/application/SendJourneyLinkEmailButton";
import { Card } from "@/components/ui/Card";
import {
  listActiveApplicators,
  listJourneys,
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
                              Fractais
                            </p>
                            <div className="mt-1 space-y-2 text-[15px] leading-7 text-slate-700">
                              {((item as any).fractals ?? []).map((fractal: any) => (
                                <p key={fractal.position} className="whitespace-pre-wrap">
                                  <span className="font-semibold text-[#0F2D4A]">
                                    Fractal {fractal.position}:
                                  </span>{" "}
                                  {fractal.activity || "-"}
                                </p>
                              ))}
                            </div>
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
                              {item.status === "created" || item.status === "link_sent" ? (
                                <>
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-[#0F2D4A] underline"
                                  >
                                    Abrir link
                                  </a>
                                  <CopyLinkButton path={link} />
                                  <SendJourneyLinkEmailButton journeyId={item.id} disabled={!item.participant_email} />
                                  <DeletePendingJourneyButton journeyId={item.id} />
                                </>
                              ) : null}

                              {(item.status === "completed" || item.status === "exported") &&
                              (item as any).response_id ? (
                                <GenerateReportButton responseId={(item as any).response_id} />
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
                                <EditJourneyForm
                                  journeyId={item.id}
                                  participantName={item.participant_name}
                                  participantEmail={item.participant_email || ""}
                                  participantCpf={(item as any).participant_cpf || ""}
                                  participantNaturalidade={(item as any).participant_naturalidade || ""}
                                  participantBirthDate={(item as any).participant_birth_date || ""}
                                  participantObjective={(item as any).participant_objective || ""}
                                  fractals={((item as any).fractals ?? []).map((fractal: any) => ({
                                    position: Number(fractal.position),
                                    activity: String(fractal.activity || ""),
                                    vortex: String(fractal.vortex || ""),
                                    connection_point: String(fractal.connection_point || ""),
                                    fractal_code: String(fractal.fractal_code || ""),
                                  }))}
                                />
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
