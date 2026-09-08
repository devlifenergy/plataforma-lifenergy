import Link from "next/link";
import { GeneratePdiButton } from "@/components/application/GeneratePdiButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { listPdiPageData, savePdiContext } from "@/services/pdi/actions";
import { getCorporateDocumentCategoryLabel } from "@/services/pdi/corporateKnowledge";

function normalizeCpf(value: string | null) { return String(value ?? "").replace(/\D/g, ""); }
function formatCpf(value: string | null) { const d = normalizeCpf(value); return d.length === 11 ? d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : "CPF não informado"; }

function Field({ name, label, value, required = false }: { name: string; label: string; value?: string | null; required?: boolean }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}{required ? " *" : ""}</span><input name={name} required={required} defaultValue={value ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#B8860B]" /></label>;
}
function Area({ name, label, value }: { name: string; label: string; value?: string | null }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><textarea name={name} rows={3} defaultValue={value ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-3 leading-6 outline-none focus:border-[#B8860B]" /></label>;
}

export default async function PdiCorporativoPage() {
  const { candidates, libraryStatus } = await listPdiPageData();
  const missingLabels = libraryStatus.missing.map(getCorporateDocumentCategoryLabel);
  const groups = new Map<string, any[]>();
  for (const candidate of candidates as any[]) {
    const key = normalizeCpf(candidate.cpf) || `sem-cpf-${candidate.responseId}`;
    groups.set(key, [...(groups.get(key) ?? []), candidate]);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#B98A2E]">Desenvolvimento corporativo</p>
        <h1 className="mt-1 text-3xl font-bold text-[#0F2D4A]">PDI Corporativo</h1>
        <p className="mt-2 max-w-4xl text-slate-500">Os formulários são consolidados por CPF e o PDI é direcionado pelo cargo informado no Contexto Operacional.</p>
      </div>

      {!libraryStatus.ready ? (
        <Card><div className="rounded-2xl bg-amber-50 p-5 text-amber-900"><p className="font-bold">Biblioteca Corporativa pendente</p><p className="mt-2 text-sm leading-6">Documentos obrigatórios: {missingLabels.join("; ")}.</p><Link href="/painel/biblioteca" className="mt-4 inline-flex rounded-full bg-[#0F2D4A] px-4 py-2 text-sm font-bold text-white">Abrir Biblioteca Corporativa</Link></div></Card>
      ) : null}

      {Array.from(groups.entries()).map(([cpfKey, items]) => {
        const candidate = items[0];
        const ctx = candidate.context;
        const hasCargo = Boolean(ctx?.current_job_title?.trim());
        const generated = (candidate.generatedPdis ?? []).some((item: any) => item.pdi_type === "corporate");
        const blocked = !libraryStatus.ready
          ? "Complete a Biblioteca Corporativa antes de gerar o PDI."
          : !hasCargo
            ? "Informe e salve o Cargo atual no Contexto Operacional antes de gerar o PDI Corporativo."
            : null;

        return (
          <Card key={cpfKey}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">CPF</p>
                <h2 className="mt-1 text-xl font-bold text-[#0F2D4A]">{formatCpf(candidate.cpf)}</h2>
                <p className="mt-1 text-sm text-slate-500">{candidate.participantName}</p>
              </div>
              <span className="rounded-full bg-[#0F2D4A]/8 px-3 py-1 text-sm font-semibold text-[#0F2D4A]">
                {items.length} {items.length === 1 ? "formulário consolidado" : "formulários consolidados"}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
                <div>
                  <p className="text-sm font-semibold text-[#B98A2E]">Registro âncora: {candidate.code}</p>
                  <p className="mt-2 text-sm text-slate-600">Cargo: <strong>{ctx?.current_job_title || "não informado"}</strong> · Área: {ctx?.current_area || "-"}</p>
                  <p className="mt-1 text-xs text-slate-500">{generated ? "PDI Corporativo já gerado" : "Aguardando geração"}</p>
                  {items.length > 1 ? (
                    <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
                      Formulários incorporados: {items.map((item) => item.code).join(", ")}.
                    </div>
                  ) : null}
                </div>
                <GeneratePdiButton responseId={candidate.responseId} pdiType="corporate" disabledReason={blocked} />
              </div>

              <details className="mt-4 rounded-xl bg-slate-50 p-4">
                <summary className="cursor-pointer list-none font-bold text-[#0F2D4A] underline">Contexto Operacional do PDI</summary>
                <form action={savePdiContext} className="mt-4 space-y-4">
                  <input type="hidden" name="journey_response_id" value={candidate.responseId} />
                  <input type="hidden" name="pdi_type" value="corporate" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Tipo de pessoa avaliada</span><select name="person_type" defaultValue={ctx?.person_type ?? "employee"} className="w-full rounded-xl border border-slate-300 px-4 py-3"><option value="employee">Empregado da empresa</option><option value="external">Avaliado externo</option></select></label>
                    <Field name="current_job_title" label="Cargo atual" value={ctx?.current_job_title} required />
                    <Field name="current_area" label="Área" value={ctx?.current_area} />
                    <Field name="manager_name" label="Gestor imediato" value={ctx?.manager_name} />
                  </div>
                  <Area name="context_summary" label="Contexto atual" value={ctx?.context_summary} />
                  <Area name="current_situation" label="Situação atual" value={ctx?.current_situation} />
                  <Area name="current_challenges" label="Desafios atuais" value={ctx?.current_challenges} />
                  <Area name="development_priorities" label="Prioridades de desenvolvimento" value={ctx?.development_priorities} />
                  <Area name="career_direction" label="Direcionamento de carreira / desenvolvimento" value={ctx?.career_direction} />
                  <div className="flex justify-end"><Button type="submit">Salvar Contexto Operacional</Button></div>
                </form>
              </details>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
