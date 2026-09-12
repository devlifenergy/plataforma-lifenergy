import Link from "next/link";
import { GeneratePdiButton } from "@/components/application/GeneratePdiButton";
import { LicenseBalanceCards } from "@/components/application/LicenseBalanceCards";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { listPdiPageData, savePdiContext } from "@/services/pdi/actions";
import { getCorporateDocumentCategoryLabel } from "@/services/pdi/corporateKnowledge";
import { getCurrentOrganizationLicenseSummary } from "@/services/licensing/licenseGuard";

function normalizeCpf(value: string | null) { return String(value ?? "").replace(/\D/g, ""); }
function formatCpf(value: string | null) { const d = normalizeCpf(value); return d.length === 11 ? d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : "CPF não informado"; }

function Field({ name, label, value, required = false }: { name: string; label: string; value?: string | null; required?: boolean }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}{required ? " *" : ""}</span><input name={name} required={required} defaultValue={value ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#B8860B]" /></label>;
}
function Area({ name, label, value }: { name: string; label: string; value?: string | null }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><textarea name={name} rows={3} defaultValue={value ?? ""} className="w-full rounded-xl border border-slate-300 px-4 py-3 leading-6 outline-none focus:border-[#B8860B]" /></label>;
}

export default async function PdiCorporativoPage() {
  const [{ candidates, libraryStatus }, licenseSummary] = await Promise.all([
    listPdiPageData(),
    getCurrentOrganizationLicenseSummary(),
  ]);
  const missingLabels = libraryStatus.missing.map(getCorporateDocumentCategoryLabel);
  const reportCandidates = (candidates as any[]).filter((candidate) => Boolean(candidate.generatedReport));
  const groups = new Map<string, any[]>();
  for (const candidate of reportCandidates) {
    const key = normalizeCpf(candidate.cpf) || `sem-cpf-${candidate.responseId}`;
    groups.set(key, [...(groups.get(key) ?? []), candidate]);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#B98A2E]">Desenvolvimento corporativo</p>
        <h1 className="mt-1 text-3xl font-bold text-[#0F2D4A]">PDI Corporativo</h1>
        <p className="mt-2 max-w-4xl text-slate-500">A listagem é agrupada por CPF. Cada Relatório Relacional gera um PDI Corporativo próprio, direcionado pelo cargo informado no Contexto Operacional.</p>
      </div>

      <LicenseBalanceCards summary={licenseSummary} show={["corporate"]} />

      {!libraryStatus.ready ? (
        <Card><div className="rounded-2xl bg-amber-50 p-5 text-amber-900"><p className="font-bold">Biblioteca Corporativa pendente</p><p className="mt-2 text-sm leading-6">Documentos obrigatórios: {missingLabels.join("; ")}.</p><Link href="/painel/biblioteca" className="mt-4 inline-flex rounded-full bg-[#0F2D4A] px-4 py-2 text-sm font-bold text-white">Abrir Biblioteca Corporativa</Link></div></Card>
      ) : null}

      {reportCandidates.length === 0 ? (
        <Card><p className="rounded-xl bg-slate-50 px-4 py-4 text-[15px] text-slate-500">Nenhum Relatório Relacional disponível para geração de PDI Corporativo.</p></Card>
      ) : Array.from(groups.entries()).map(([cpfKey, items]) => (
        <Card key={cpfKey}>
          <div className="mb-5 border-b border-slate-200 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">CPF</p>
            <h2 className="mt-1 text-xl font-bold text-[#0F2D4A]">{formatCpf(items[0]?.cpf ?? null)}</h2>
            <p className="mt-1 text-sm text-slate-500">{items[0]?.participantName}</p>
          </div>

          <div className="space-y-4">
            {items.map((candidate) => {
              const ctx = candidate.context;
              const hasCargo = Boolean(ctx?.current_job_title?.trim());
              const generated = (candidate.generatedPdis ?? []).some((item: any) => item.pdi_type === "corporate");
              const noLicense = !generated && licenseSummary.pdiCorporate.available <= 0;
              const blocked = !libraryStatus.ready
                ? "Complete a Biblioteca Corporativa antes de gerar o PDI."
                : !hasCargo
                  ? "Informe e salve o Cargo atual no Contexto Operacional antes de gerar o PDI Corporativo."
                  : noLicense
                    ? "Sem licenças disponíveis para gerar um novo PDI Corporativo."
                    : null;

              return (
                <div key={candidate.responseId} className="rounded-2xl border border-slate-200 p-5">
                  <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
                    <div>
                      <p className="text-sm font-semibold text-[#B98A2E]">Relatório {candidate.code}</p>
                      <p className="mt-2 text-sm text-slate-600">Cargo: <strong>{ctx?.current_job_title || "não informado"}</strong> · Área: {ctx?.current_area || "-"}</p>
                      <p className="mt-1 text-xs text-slate-500">{generated ? "PDI Corporativo já gerado e salvo" : "Aguardando geração"}</p>
                    </div>
                    <GeneratePdiButton responseId={candidate.responseId} pdiType="corporate" label={generated ? "Baixar PDI Corporativo" : "Gerar PDI Corporativo"} disabledReason={blocked} />
                  </div>

                  <details className="mt-4 rounded-xl bg-slate-50 p-4">
                    <summary className="cursor-pointer list-none font-bold text-[#0F2D4A] underline">Contexto Operacional do PDI</summary>
                    <form action={savePdiContext} className="mt-4 space-y-4">
                      <input type="hidden" name="journey_response_id" value={candidate.responseId} />
                      <input type="hidden" name="pdi_type" value="corporate" />
                      <div className="grid gap-4 md:grid-cols-2">
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
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
