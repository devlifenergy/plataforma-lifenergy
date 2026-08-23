import { CorporateDocumentForm } from "@/components/application/CorporateDocumentForm";
import { GeneratePdiButton } from "@/components/application/GeneratePdiButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  archiveOrganizationDocument,
  listPdiPageData,
  savePdiContext,
} from "@/services/pdi/actions";
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

function TextareaField({ name, label, defaultValue, rows = 3 }: { name: string; label: string; defaultValue?: string | null; rows?: number }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
        {label}
      </span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        className="min-h-24 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-base leading-7 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
      />
    </label>
  );
}

function InputField({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string | null }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-semibold leading-6 text-slate-700">
        {label}
      </span>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base leading-6 text-slate-900 outline-none transition focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20"
      />
    </label>
  );
}

export default async function PdiPage() {
  const { documents, libraryStatus, candidates, categories } = await listPdiPageData();
  const missingLabels = libraryStatus.missing.map(getCorporateDocumentCategoryLabel);
  const corporateBlockedReason = libraryStatus.ready
    ? null
    : `PDI Corporativo bloqueado. Documentos obrigatórios da empresa pendentes: ${missingLabels.join("; ")}.`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0F2D4A]">PDI</h1>
        <p className="mt-1 max-w-4xl text-slate-500">
          Ambiente separado para gerar PDIs Relacionais e Corporativos, alimentar a Biblioteca Corporativa Inteligente e preparar o plano de desenvolvimento do avaliado.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">
            PDI de Desenvolvimento Relacional
          </p>
          <h2 className="mt-2 text-xl font-bold text-[#0F2D4A]">Liberado por avaliação concluída</h2>
          <p className="mt-2 text-[15px] leading-6 text-slate-600">
            Usa o Relatório Lifenergy e o contexto operacional informado no PDI. Não exige documentos corporativos e não presume cargo, gestor ou metas da empresa.
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
              Os quatro documentos empresariais mínimos foram cadastrados com conteúdo para uso da IA.
            </p>
          ) : (
            <div className="mt-2 rounded-xl bg-amber-50 px-4 py-3 text-[15px] leading-6 text-amber-800">
              <p className="font-bold">Documentos obrigatórios pendentes:</p>
              <ul className="mt-2 list-disc pl-5">
                {missingLabels.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="mb-5 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-[#0F2D4A]">Biblioteca Corporativa Inteligente</h2>
          <p className="mt-1 text-[15px] leading-6 text-slate-600">
            Cadastre documentos da empresa. Para liberar o PDI Corporativo, são obrigatórios: cultura/valores, matriz de competências, descrição de cargos/funções e estratégia/metas/prioridades. Não há exigência de termo ou política de uso do PDI.
          </p>
        </div>

        <CorporateDocumentForm categories={categories} />

        <div className="mt-8 space-y-3">
          <h3 className="text-lg font-bold text-[#0F2D4A]">Documentos ativos</h3>
          {documents.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-4 py-4 text-[15px] text-slate-500">
              Nenhum documento cadastrado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Categoria</th>
                    <th className="px-4 py-3">Documento</th>
                    <th className="px-4 py-3">Arquivo</th>
                    <th className="px-4 py-3">Conteúdo IA</th>
                    <th className="px-4 py-3">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(documents as any[]).map((doc: any) => (
                    <tr key={doc.id} className="align-top">
                      <td className="px-4 py-3 font-semibold text-[#0F2D4A]">
                        {getCorporateDocumentCategoryLabel(doc.category)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{doc.title}</td>
                      <td className="px-4 py-3 text-slate-500">{doc.file_name || "Texto informado"}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {String(doc.content_text || "").length.toLocaleString("pt-BR")} caracteres
                      </td>
                      <td className="px-4 py-3">
                        <form action={archiveOrganizationDocument}>
                          <input type="hidden" name="document_id" value={doc.id} />
                          <button className="rounded-full border border-red-200 px-3 py-1 text-xs font-bold text-red-700 hover:bg-red-50">
                            Arquivar
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="mb-5 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-[#0F2D4A]">PDIs por avaliado</h2>
          <p className="mt-1 text-[15px] leading-6 text-slate-600">
            Selecione o tipo de PDI e, se necessário, registre o contexto operacional do avaliado. O contexto não é documento obrigatório da Biblioteca Corporativa.
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
              const generatedTypes = new Set(
                (candidate.generatedPdis ?? []).map((item: any) => item.pdi_type)
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
                    </div>

                    <div className="flex flex-col gap-3 md:items-end">
                      <GeneratePdiButton responseId={candidate.responseId} pdiType="relational" />
                      <GeneratePdiButton
                        responseId={candidate.responseId}
                        pdiType="corporate"
                        disabledReason={corporateBlockedReason}
                      />
                    </div>
                  </div>

                  <details className="mt-5 rounded-xl bg-slate-50 p-4">
                    <summary className="cursor-pointer list-none font-bold text-[#0F2D4A] underline">
                      Contexto operacional do PDI
                    </summary>

                    <form action={savePdiContext} className="mt-4 space-y-4">
                      <input type="hidden" name="journey_response_id" value={candidate.responseId} />

                      <div className="grid gap-4 md:grid-cols-3">
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

                        <InputField name="current_job_title" label="Cargo atual" defaultValue={context?.current_job_title} />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <InputField name="current_area" label="Área" defaultValue={context?.current_area} />
                        <InputField name="manager_name" label="Gestor imediato" defaultValue={context?.manager_name} />
                      </div>

                      <TextareaField name="context_summary" label="Contexto atual do avaliado" defaultValue={context?.context_summary} />
                      <TextareaField name="current_situation" label="Situação atual" defaultValue={context?.current_situation} />
                      <TextareaField name="current_challenges" label="Principais desafios atuais" defaultValue={context?.current_challenges} />
                      <TextareaField name="development_priorities" label="Prioridades de desenvolvimento percebidas" defaultValue={context?.development_priorities} />
                      <TextareaField name="career_direction" label="Direcionamento de carreira / desenvolvimento" defaultValue={context?.career_direction} />

                      <Button type="submit">Salvar contexto do PDI</Button>
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
