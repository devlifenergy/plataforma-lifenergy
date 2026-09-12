import { GeneratePdiButton } from "@/components/application/GeneratePdiButton";
import { LicenseBalanceCards } from "@/components/application/LicenseBalanceCards";
import { Card } from "@/components/ui/Card";
import { listPdiPageData } from "@/services/pdi/actions";
import { getCurrentOrganizationLicenseSummary } from "@/services/licensing/licenseGuard";

function normalizeCpf(value: string | null) {
  return String(value ?? "").replace(/\D/g, "");
}

function formatCpf(value: string | null) {
  const digits = normalizeCpf(value);
  return digits.length === 11 ? digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : "CPF não informado";
}

function formatDate(value: string | null) {
  if (!value) return "-";
  const match = String(value).slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : String(value);
}

export default async function PdiRelacionalPage() {
  const [{ candidates }, licenseSummary] = await Promise.all([
    listPdiPageData(),
    getCurrentOrganizationLicenseSummary(),
  ]);

  const reportCandidates = (candidates as any[]).filter((candidate) => Boolean(candidate.generatedReport));
  const groups = new Map<string, any[]>();
  for (const candidate of reportCandidates) {
    const key = normalizeCpf(candidate.cpf) || `sem-cpf-${candidate.responseId}`;
    groups.set(key, [...(groups.get(key) ?? []), candidate]);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#B98A2E]">Desenvolvimento humano</p>
        <h1 className="mt-1 text-3xl font-bold text-[#0F2D4A]">PDI Relacional</h1>
        <p className="mt-2 max-w-4xl text-slate-500">A listagem é agrupada por CPF, mas cada relatório gera o seu próprio PDI Relacional.</p>
      </div>

      <LicenseBalanceCards summary={licenseSummary} show={["relational"]} />

      {reportCandidates.length === 0 ? (
        <Card><p className="rounded-xl bg-slate-50 px-4 py-4 text-[15px] text-slate-500">Nenhum Relatório Relacional disponível para geração de PDI.</p></Card>
      ) : (
        Array.from(groups.entries()).map(([cpfKey, items]) => (
          <Card key={cpfKey}>
            <div className="mb-5 border-b border-slate-200 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">CPF</p>
              <h2 className="mt-1 text-xl font-bold text-[#0F2D4A]">{formatCpf(items[0]?.cpf ?? null)}</h2>
              <p className="mt-1 text-sm text-slate-500">{items[0]?.participantName}</p>
            </div>

            <div className="space-y-3">
              {items.map((candidate) => {
                const generated = (candidate.generatedPdis ?? []).some((item: any) => item.pdi_type === "relational");
                const noLicense = !generated && licenseSummary.pdiRelational.available <= 0;
                return (
                  <div key={candidate.responseId} className="grid gap-4 rounded-2xl border border-slate-200 p-5 lg:grid-cols-[1fr_280px] lg:items-center">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B98A2E]">Relatório {candidate.code}</p>
                      <p className="mt-2 text-[15px] leading-6 text-slate-600">Aplicador: {candidate.applicatorName} · Concluído em {formatDate(candidate.completedAt)}</p>
                      <p className="mt-1 text-sm text-slate-500">{generated ? "PDI Relacional já gerado e salvo" : "Disponível para geração"}</p>
                    </div>
                    <GeneratePdiButton
                      responseId={candidate.responseId}
                      pdiType="relational"
                      label={generated ? "Baixar PDI Relacional" : "Gerar PDI Relacional"}
                      disabledReason={noLicense ? "Sem licenças disponíveis para gerar um novo PDI Relacional." : null}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
