import { GeneratePdiButton } from "@/components/application/GeneratePdiButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { listPdiPageData, savePdiContext } from "@/services/pdi/actions";

function formatCpf(value: string | null) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length !== 11) return "CPF não informado";
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatDate(value: string | null) {
  if (!value) return "-";
  const match = String(value).slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : String(value);
}

export default async function PdiRelacionalPage() {
  const { candidates } = await listPdiPageData();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#B98A2E]">Desenvolvimento humano</p>
        <h1 className="mt-1 text-3xl font-bold text-[#0F2D4A]">PDI Relacional</h1>
        <p className="mt-2 max-w-4xl text-slate-500">Gere o PDI de Desenvolvimento Relacional a partir das avaliações concluídas.</p>
      </div>

      <Card>
        {candidates.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-4 py-4 text-[15px] text-slate-500">Nenhuma avaliação concluída disponível para PDI.</p>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate: any) => {
              const relationalGenerated = (candidate.generatedPdis ?? []).some((item: any) => item.pdi_type === "relational");
              return (
                <div key={candidate.responseId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="grid gap-5 lg:grid-cols-[1fr_280px] lg:items-start">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B98A2E]">{candidate.code}</p>
                      <h2 className="mt-1 text-xl font-bold text-[#0F2D4A]">{candidate.participantName}</h2>
                      <p className="mt-2 text-[15px] leading-6 text-slate-600">CPF: {formatCpf(candidate.cpf)} · Aplicador: {candidate.applicatorName} · Concluído em {formatDate(candidate.completedAt)}</p>
                      <p className="mt-1 text-sm text-slate-500">Status: {relationalGenerated ? "PDI Relacional já gerado" : "Disponível para geração"}</p>
                    </div>
                    <GeneratePdiButton responseId={candidate.responseId} pdiType="relational" />
                  </div>
                  <details className="mt-4 rounded-xl bg-slate-50 p-4">
                    <summary className="cursor-pointer list-none font-bold text-[#0F2D4A] underline">Contexto complementar do PDI</summary>
                    <form action={savePdiContext} className="mt-4 grid gap-4 md:grid-cols-2">
                      <input type="hidden" name="journey_response_id" value={candidate.responseId} />
                      <input type="hidden" name="pdi_type" value="relational" />
                      <input type="hidden" name="person_type" value={candidate.context?.person_type ?? "external"} />
                      <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Cargo atual</span><input name="current_job_title" defaultValue={candidate.context?.current_job_title ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
                      <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Área</span><input name="current_area" defaultValue={candidate.context?.current_area ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
                      <div className="md:col-span-2 flex justify-end"><Button type="submit">Salvar contexto</Button></div>
                    </form>
                  </details>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
