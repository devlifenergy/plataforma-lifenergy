/** Rota alternativa opt-in. Fluxo V1 fica inteiramente intacto quando a flag está desativada. */
import { createAdminClient } from "@/lib/supabaseAdmin";
import { assertLicenseAvailable } from "@/services/licensing/licenseGuard";
import { logAuditEvent } from "@/services/audit/auditLog";
import { buildLifenergyReportFileName } from "@/services/reports/lifenergyV1Docx";
import type { LifenergyV1ReportData } from "../lifenergyV1Types";
import type { RelatorioCanonico } from "./canonicalTypes";
import { gerarRelatorioCanonico } from "./canonicalOpenAI";
import { buildCanonicalDocx } from "./canonicalDocx";

const VERSAO = "lifenergy_schema_usuario_v1_20261022";
const MOTOR = "canonico_py_json_port_node_v1";
const PROMPT = "prompt_sistema_original_ajuste_json_autorizado";
const TEMPLATE = "docx_padroes_canonicos_v1";

function disposition(nome: string) {
  const safe = nome.replace(/[^a-zA-Z0-9_.-]+/g, "_");
  return `attachment; filename="${safe}"; filename*=UTF-8''${encodeURIComponent(nome)}`;
}

function isCanonical(content: unknown): content is RelatorioCanonico {
  const c = content as RelatorioCanonico;
  return Boolean(c && c.identificacao && c.registro_aplicacao && Array.isArray(c.fractais) &&
    c.calculo_atributos && Array.isArray(c.padroes_psicologicos) &&
    typeof c.sintese_resultados === "string" && typeof c.recomendacoes === "string");
}

export async function gerarRotaCanonica(params: {
  data: LifenergyV1ReportData;
  regenerar: boolean;
}): Promise<Response> {
  const { data, regenerar } = params;
  if (regenerar && data.profile.role !== "super_admin") {
    return Response.json({ error: "A regeneração é restrita ao super usuário." }, { status: 403 });
  }
  const admin = createAdminClient();
  const { data: salvo, error: lookupError } = await admin.from("generated_reports")
    .select("id, generated_content_json, source_snapshot_json, file_name")
    .eq("journey_response_id", data.response.id)
    .eq("report_version", VERSAO)
    .eq("format", "docx")
    .eq("status", "generated")
    .maybeSingle();
  if (lookupError) throw new Error(lookupError.message);

  if (!salvo) await assertLicenseAvailable({
    organizationId: data.organization.id, kind: "individual_report", responseId: data.response.id,
  });

  let documento: RelatorioCanonico;
  let base: LifenergyV1ReportData = data;
  let nomeArquivo = buildLifenergyReportFileName(data);
  const reutilizado = !regenerar && salvo && isCanonical(salvo.generated_content_json);
  let avisos: string[] = [];
  if (reutilizado) {
    documento = salvo.generated_content_json as RelatorioCanonico;
    base = (salvo.source_snapshot_json as LifenergyV1ReportData) || data;
    nomeArquivo = salvo.file_name || buildLifenergyReportFileName(base);
  } else {
    const generated = await gerarRelatorioCanonico(data);
    documento = generated.relatorio;
    avisos = generated.avisos;
    const { error } = await admin.from("generated_reports").upsert({
      organization_id: data.organization.id,
      journey_id: data.journey.id,
      journey_response_id: data.response.id,
      report_version: VERSAO,
      format: "docx", status: "generated",
      generated_by: data.profile.id,
      model: generated.modelo,
      engine_version: MOTOR,
      prompt_version: PROMPT,
      template_version: TEMPLATE,
      source_snapshot_json: data,
      generated_content_json: documento, // JSON original: nenhuma chave extra
      file_name: nomeArquivo,
      updated_at: new Date().toISOString(),
    }, { onConflict: "journey_response_id,report_version,format" });
    if (error) throw new Error(error.message);
  }

  const buffer = buildCanonicalDocx(base, documento);
  await logAuditEvent({
    action: "report.relational_generated",
    organizationId: data.organization.id,
    organizationName: data.organization.name,
    actorProfileId: data.profile.id,
    actorName: data.profile.name,
    actorEmail: data.profile.email,
    entityType: "journey_response",
    entityId: data.response.id,
    description: "Relatório Lifenergy do motor canônico gerado.",
    metadata: {
      journey_id: data.journey.id,
      report_version: VERSAO,
      regenerate: regenerar,
      reused_existing_document: Boolean(reutilizado),
      avisos_calculo: avisos,
    },
  });
  return new Response(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": disposition(nomeArquivo),
      "Cache-Control": "no-store",
    },
  });
}
