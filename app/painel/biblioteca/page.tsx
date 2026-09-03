import { CompanyLogoForm } from "@/components/application/CompanyLogoForm";
import { CorporateDocumentForm } from "@/components/application/CorporateDocumentForm";
import { Card } from "@/components/ui/Card";
import {
  archiveOrganizationDocument,
  listPdiPageData,
  updateOrganizationDocument,
} from "@/services/pdi/actions";
import { getCorporateDocumentCategoryLabel } from "@/services/pdi/corporateKnowledge";

export default async function BibliotecaCorporativaPage() {
  const { organization, documents, libraryStatus, categories } = await listPdiPageData();
  const missingLabels = libraryStatus.missing.map(getCorporateDocumentCategoryLabel);

  const logoDataUrl = organization?.logo_content_base64 && organization?.logo_mime_type
    ? `data:${organization.logo_mime_type};base64,${organization.logo_content_base64}`
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0F2D4A]">Biblioteca Corporativa Inteligente</h1>
        <p className="mt-1 max-w-4xl text-slate-500">
          Cadastre documentos da empresa para que a IA gere contexto corporativo interno e libere o PDI Corporativo.
        </p>
      </div>

      <Card>
        <div className="mb-5 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-[#0F2D4A]">Logomarca da empresa</h2>
          <p className="mt-1 text-[15px] leading-6 text-slate-600">
            A logomarca cadastrada será usada no cabeçalho dos próximos relatórios gerados pela plataforma.
          </p>
        </div>

        <CompanyLogoForm
          hasLogo={Boolean(organization?.logo_content_base64)}
          logoFileName={organization?.logo_file_name}
          logoDataUrl={logoDataUrl}
        />
      </Card>

      <Card>
        <div className="mb-5 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-[#0F2D4A]">Documentos da empresa</h2>
          <p className="mt-1 text-[15px] leading-6 text-slate-600">
            Para liberar o PDI Corporativo, são obrigatórios: cultura/valores, matriz de competências, descrição de cargos/funções e estratégia/metas/prioridades.
          </p>
        </div>

        {libraryStatus.ready ? (
          <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-[15px] font-medium leading-6 text-emerald-700">
            Biblioteca pronta para geração de PDI Corporativo.
          </p>
        ) : (
          <div className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-[15px] leading-6 text-amber-800">
            <p className="font-bold">Documentos obrigatórios pendentes:</p>
            <ul className="mt-2 list-disc pl-5">
              {missingLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>
        )}

        <CorporateDocumentForm categories={categories} />

        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium leading-6 text-amber-800">
          Ao editar ou atualizar documentos corporativos, os PDIs Corporativos já gerados devem ser gerados novamente para se adequar ao novo contexto da empresa.
        </p>
      </Card>

      <Card>
        <div className="mb-5 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-[#0F2D4A]">Documentos avaliados</h2>
          <p className="mt-1 text-[15px] leading-6 text-slate-600">
            O campo Documento é a referência principal. O nome técnico do arquivo não é exibido nesta tabela.
          </p>
        </div>

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
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(documents as any[]).map((doc: any) => (
                  <tr key={doc.id} className="align-top">
                    <td className="px-4 py-3 font-semibold text-[#0F2D4A]">
                      {getCorporateDocumentCategoryLabel(doc.category)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{doc.title}</td>
                    <td className="px-4 py-3">
                      <div className="flex min-w-[340px] flex-wrap items-start gap-2">
                        <a
                          href={`/api/pdi/documents/${doc.id}/download`}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          Fazer Download
                        </a>

                        <details className="rounded-xl border border-slate-200 bg-white px-3 py-1">
                          <summary className="cursor-pointer text-xs font-bold text-[#0F2D4A]">
                            Editar
                          </summary>
                          <form action={updateOrganizationDocument} className="mt-3 grid min-w-[280px] gap-2">
                            <input type="hidden" name="document_id" value={doc.id} />
                            <label className="text-xs font-semibold text-slate-600">
                              Categoria do documento
                            </label>
                            <select
                              name="category"
                              defaultValue={doc.category}
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            >
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.label}
                                </option>
                              ))}
                            </select>
                            <button className="rounded-full border border-[#B8860B] px-3 py-1 text-xs font-bold text-[#0F2D4A] hover:bg-[#B8860B]/10">
                              Salvar categoria
                            </button>
                          </form>
                        </details>

                        <details className="rounded-xl border border-slate-200 bg-white px-3 py-1">
                          <summary className="cursor-pointer text-xs font-bold text-[#0F2D4A]">
                            Atualizar
                          </summary>
                          <form action={updateOrganizationDocument} className="mt-3 grid min-w-[300px] gap-2">
                            <input type="hidden" name="document_id" value={doc.id} />
                            <input type="hidden" name="category" value={doc.category} />
                            <input
                              id={`update-file-${doc.id}`}
                              type="file"
                              name="file"
                              required
                              accept=".txt,.md,.csv,.json,.docx,text/plain,text/markdown,text/csv,application/json,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              className="sr-only"
                            />
                            <label
                              htmlFor={`update-file-${doc.id}`}
                              className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#0F2D4A] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0F2D4A]/90"
                            >
                              Selecionar arquivo atualizado
                            </label>
                            <p className="text-xs leading-5 text-slate-500">
                              Escolha o novo arquivo corporativo que substituirá o documento atual.
                            </p>
                            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
                              Ao atualizar este documento, os PDIs Corporativos já gerados devem ser gerados novamente para refletir o novo contexto.
                            </p>
                            <button className="rounded-full border border-[#B8860B] px-3 py-1 text-xs font-bold text-[#0F2D4A] hover:bg-[#B8860B]/10">
                              Atualizar documento
                            </button>
                          </form>
                        </details>

                        <form action={archiveOrganizationDocument}>
                          <input type="hidden" name="document_id" value={doc.id} />
                          <button className="rounded-full border border-red-200 px-3 py-1 text-xs font-bold text-red-700 hover:bg-red-50">
                            Arquivar
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
