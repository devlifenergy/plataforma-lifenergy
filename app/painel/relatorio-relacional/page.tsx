import { GenerateReportButton } from "@/components/application/GenerateReportButton";
import { LicenseBalanceCards } from "@/components/application/LicenseBalanceCards";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabaseServer";
import { listJourneys } from "@/services/journeys/actions";
import { getCurrentOrganizationLicenseSummary } from "@/services/licensing/licenseGuard";

function normalizeCpf(value: string | null) {
  return String(value ?? "").replace(/\D/g, "");
}

function formatCpf(value: string | null) {
  const digits = normalizeCpf(value);
  return digits.length === 11 ? digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : "CPF não informado";
}

export default async function RelatorioRelacionalPage() {
  const [journeys, licenseSummary] = await Promise.all([
    listJourneys(),
    getCurrentOrganizationLicenseSummary(),
  ]);

  const completed = journeys.filter((item) => (item.status === "completed" || item.status === "exported") && item.response_id);
  const responseIds = completed.map((item) => item.response_id).filter(Boolean) as string[];
  const generatedByResponse = new Map<string, any>();

  if (responseIds.length > 0) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("generated_reports")
      .select("id, journey_response_id, created_at, file_name")
      .in("journey_response_id", responseIds)
      .eq("status", "generated")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    for (const report of data ?? []) {
      if (!generatedByResponse.has(report.journey_response_id)) generatedByResponse.set(report.journey_response_id, report);
    }
  }

  const groups = new Map<string, typeof completed>();
  for (const item of completed) {
    const key = normalizeCpf(item.cpf) || `sem-cpf-${item.id}`;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#B98A2E]">Relatórios</p>
        <h1 className="mt-1 text-3xl font-bold text-[#0F2D4A]">Relatório Relacional</h1>
        <p className="mt-2 max-w-4xl text-slate-500">Gere um relatório para cada aplicação concluída. Documentos já gerados podem ser baixados novamente sem consumir nova licença.</p>
      </div>

      <LicenseBalanceCards summary={licenseSummary} show={["individual"]} />

      {completed.length === 0 ? (
        <Card><p className="rounded-xl bg-slate-50 px-4 py-4 text-[15px] text-slate-500">Nenhuma aplicação concluída disponível para geração de relatório.</p></Card>
      ) : (
        Array.from(groups.entries()).map(([cpfKey, items]) => (
          <Card key={cpfKey}>
            <div className="mb-5 border-b border-slate-200 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B98A2E]">CPF</p>
              <h2 className="mt-1 text-xl font-bold text-[#0F2D4A]">{formatCpf(items[0]?.cpf ?? null)}</h2>
            </div>
            <div className="space-y-3">
              {items.map((item) => {
                const responseId = item.response_id as string;
                const stored = generatedByResponse.get(responseId);
                const noLicense = !stored && licenseSummary.individualReport.available <= 0;
                return (
                  <div key={item.id} className="grid gap-4 rounded-2xl border border-slate-200 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#B98A2E]">{item.code}</p>
                      <h3 className="mt-1 text-lg font-bold text-[#0F2D4A]">{item.participant_name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{stored ? "Relatório já gerado e salvo" : "Novo relatório disponível para geração"}</p>
                    </div>
                    <GenerateReportButton
                      responseId={responseId}
                      label={stored ? "Baixar relatório" : "Gerar relatório"}
                      disabledReason={noLicense ? "Sem licenças disponíveis para gerar um novo relatório." : null}
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
