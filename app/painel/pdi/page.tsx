import Link from "next/link";
import { GeneratePdiButton } from "@/components/application/GeneratePdiButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { listPdiPageData, savePdiContext } from "@/services/pdi/actions";
import { getCorporateDocumentCategoryLabel } from "@/services/pdi/corporateKnowledge";

function formatCpf(value: string | null) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length !== 11) return "CPF não informado";
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = String(value).slice(0, 10);
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return date;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

function InputField({ name, label, defaultValue, placeholder }: { name: string; label: string; defaultValue?: string | null; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
      />
    </label>
  );
}

function TextareaField({ name, label, defaultValue, placeholder, rows = 3 }: { name: string; label: string; defaultValue?: string | null; placeholder?: string; rows?: number }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="min-h-24 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-base leading-7 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
      />
    </label>
  );
}

export default async function PdiPage() {
  const { documents, libraryStatus, candidates } = await listPdiPageData();
  const missingLabels = libraryStatus.missing.map(getCorporateDocumentCategoryLabel);
  const corporateBlockedReason = libraryStatus.ready
    ? null
    : `PDI Corporativo bloqueado. Documentos obrigatórios da empresa pendentes: ${missingLabels.join("; ")}.`;
  const latestCorporateLibraryUpdate = (documents as any[]).reduce((latest: string | null, doc: any) => {
    const value = doc.updated_at || doc.created_at;
    if (!value) return latest;
    if (!latest) return value;
    return new Date(value).getTime() > new Date(latest).getTime() ? value : latest;
  }, null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0F2D4A]">PDI</h1>
        <p className="mt-1 max-w-4xl text-slate-500">
          Gere PDIs Relacionais e Corporativos a partir das avaliações concluídas. A Biblioteca Corporativa Inteligente agora possui tela própria.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">
            PDI de Desenvolvimento Relacional
          </p>
          <h2 className="mt-2 text-xl font-bold text-[#0F2D4A]">Liberado por avaliação concluída</h2>
          <p className="mt-2 text-[15px] leading-6 text-slate-600">
            Usa o Relatório Lifenergy e o contexto essencial informado nesta tela. Não exige documentos corporativos.
          </p>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">
            PDI de Desenvolvimento Corporativo
          </p>
          <h2 className="mt-2 text-xl font-bold text-[#0F2D4A]">
            {libraryStatus.ready ? "Biblioteca pronta" : "Biblioteca pendente"}
          </h2>
          {libraryStatus.ready ? (
            <p className="mt-2 rounded-xl bg-emerald-50 px-4 py-3 text-[15px] font-medium leading-6 text-emerald-700">
              Os documentos mínimos da empresa já foram avaliados para uso no PDI Corporativo.
            </p>
          ) : (
            <div className="mt-2 rounded-xl bg-amber-50 px-4 py-3 text-[15px] leading-6 text-amber-800">
              <p className="font-bold">Documentos obrigatórios pendentes:</p>
              <ul className="mt-2 list-disc pl-5">
                {missingLabels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
              <Link href="/painel/biblioteca" className="mt-3 inline-flex rounded-full border border-[#B8860B] px-4 py-2 text-sm font-bold text-[#0F2D4A] hover:bg-[#B8860B]/10">
                Abrir Biblioteca Corporativa
              </Link>
            </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="mb-5 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-[#0F2D4A]">PDIs por avaliado</h2>
          <p className="mt-1 text-[15px] leading-6 text-slate-600">
            O contexto operacional foi simplificado para registrar apenas as informações que realmente direcionam o PDI.
          </p>
        </div>

        {candidates.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-4 py-4 text-[15px] text-slate-500">
            Nenhuma avaliação concluída disponível para PDI.
          </p>
        ) : (
          <div className="space-y-5">
            {candidates.map((candidate: any) => {
              const context = candidate.context;
              const generatedPdis = candidate.generatedPdis ?? [];
              const generatedTypes = new Set(generatedPdis.map((item: any) => item.pdi_type));
              const corporatePdi = generatedPdis.find((item: any) => item.pdi_type === "corporate");
              const corporatePdiNeedsRegeneration = Boolean(
                corporatePdi?.created_at &&
                  latestCorporateLibraryUpdate &&
                  new Date(latestCorporateLibraryUpdate).getTime() >
                    new Date(corporatePdi.created_at).getTime()
              );

              return (
                <div key={candidate.responseId} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#B98A2E]">
                        {candidate.code}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-[#0F2D4A]">
                        {candidate.participantName}
                      </h3>
                      <p className="mt-1 text-[15px] leading-6 text-slate-600">
                        CPF: {formatCpf(candidate.cpf)} · Aplicador: {candidate.applicatorName} · Concluído em {formatDate(candidate.completedAt)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        PDI Relacional: {generatedTypes.has("relational") ? "gerado" : "não gerado"} · PDI Corporativo: {generatedTypes.has("corporate") ? "gerado" : "não gerado"}
                      </p>
                      {corporatePdiNeedsRegeneration ? (
                        <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium leading-5 text-amber-800">
                          Documentos corporativos foram atualizados depois da geração deste PDI Corporativo. Use a opção “Gerar um novo PDI Corporativo”.
                        </p>
                      ) : null}
                    </div>

                    <div className="grid w-full gap-3 sm:grid-cols-2 md:max-w-[620px]">
                      <GeneratePdiButton responseId={candidate.responseId} pdiType="relational" />
                      <GeneratePdiButton
                        responseId={candidate.responseId}
                        pdiType="corporate"
                        disabledReason={corporateBlockedReason}
                        allowRegenerate={corporatePdiNeedsRegeneration}
                        regenerateLabel="Gerar um novo PDI Corporativo"
                      />
                    </div>
                  </div>

                  <details className="mt-5 rounded-xl bg-slate-50 p-4">
                    <summary className="cursor-pointer list-none font-bold text-[#0F2D4A] underline">
                      Contexto operacional do PDI
                    </summary>

                    <form action={savePdiContext} className="mt-4 space-y-4">
                      <input type="hidden" name="journey_response_id" value={candidate.responseId} />

                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
                            Tipo de PDI preferencial
                          </span>
                          <select
                            name="pdi_type"
                            defaultValue={context?.pdi_type ?? "relational"}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
                          >
                            <option value="relational">Desenvolvimento Relacional</option>
                            <option value="corporate">Desenvolvimento Corporativo</option>
                          </select>
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
                            Tipo de pessoa avaliada
                          </span>
                          <select
                            name="person_type"
                            defaultValue={context?.person_type ?? "external"}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
                          >
                            <option value="external">Avaliado externo</option>
                            <option value="employee">Empregado da empresa</option>
                          </select>
                        </label>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <InputField
                          name="current_job_title"
                          label="Cargo atual"
                          defaultValue={context?.current_job_title}
                          placeholder="Ex.: Analista Financeiro Pleno"
                        />
                        <InputField
                          name="current_area"
                          label="Área"
                          defaultValue={context?.current_area}
                          placeholder="Ex.: Financeiro"
                        />
                      </div>

                      <TextareaField
                        name="current_situation"
                        label="Situação atual"
                        defaultValue={context?.current_situation}
                        placeholder="Descreva, em poucas linhas, o momento atual do avaliado."
                      />
                      <TextareaField
                        name="development_priorities"
                        label="Prioridades de desenvolvimento"
                        defaultValue={context?.development_priorities}
                        placeholder="Ex.: comunicação, autonomia, organização das entregas, relacionamento com pares."
                      />

                      <div className="flex justify-end">
                        <Button type="submit">Salvar contexto do PDI</Button>
                      </div>
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
