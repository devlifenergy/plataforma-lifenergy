import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseAdmin";
import {
  generateLifenergyPdiContent,
  isLifenergyPdiGeneratedContent,
} from "@/services/pdi/lifenergyPdiAI";
import { buildLifenergyPdiDataFromReportData } from "@/services/pdi/lifenergyPdiData";
import {
  buildLifenergyPdiDocx,
  buildLifenergyPdiFileName,
} from "@/services/pdi/lifenergyPdiDocx";
import type {
  LifenergyPdiData,
  LifenergyPdiGeneratedContent,
  LifenergyPdiType,
} from "@/services/pdi/lifenergyPdiTypes";
import {
  LIFENERGY_PDI_ENGINE_VERSION,
  LIFENERGY_PDI_FORMAT,
  LIFENERGY_PDI_PROMPT_VERSION,
  LIFENERGY_PDI_TEMPLATE_VERSION,
  LIFENERGY_PDI_VERSION,
} from "@/services/pdi/lifenergyPdiTypes";
import { loadLifenergyV1ReportData } from "@/services/reports/lifenergyV1Data";

type RouteContext = {
  params: Promise<{ responseId: string }>;
};

function contentDispositionFileName(fileName: string) {
  const safeFallback = fileName.replace(/[^a-zA-Z0-9_.-]+/g, "_");
  return `attachment; filename="${safeFallback}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function readPdiType(url: URL): LifenergyPdiType {
  return url.searchParams.get("type") === "corporate" ? "corporate" : "relational";
}

async function findStoredPdi(responseId: string, pdiType: LifenergyPdiType) {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("generated_pdis")
    .select(
      "id, source_snapshot_json, generated_content_json, file_name, engine_version, prompt_version, template_version"
    )
    .eq("journey_response_id", responseId)
    .eq("pdi_type", pdiType)
    .eq("pdi_version", LIFENERGY_PDI_VERSION)
    .eq("format", LIFENERGY_PDI_FORMAT)
    .eq("status", "generated")
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
}

async function storePdi(params: {
  data: LifenergyPdiData;
  content: LifenergyPdiGeneratedContent;
  model: string;
  fileName: string;
}) {
  const admin = createAdminClient();
  const reportData = params.data.reportData;

  const { error } = await admin.from("generated_pdis").upsert(
    {
      organization_id: reportData.organization.id,
      journey_id: reportData.journey.id,
      journey_response_id: reportData.response.id,
      pdi_type: params.data.pdiType,
      pdi_version: LIFENERGY_PDI_VERSION,
      format: LIFENERGY_PDI_FORMAT,
      status: "generated",
      generated_by: reportData.profile.id,
      source_report_id: params.data.sourceReportId,
      model: params.model,
      engine_version: LIFENERGY_PDI_ENGINE_VERSION,
      prompt_version: LIFENERGY_PDI_PROMPT_VERSION,
      template_version: LIFENERGY_PDI_TEMPLATE_VERSION,
      source_snapshot_json: params.data,
      generated_content_json: params.content,
      file_name: params.fileName,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "journey_response_id,pdi_version,format,pdi_type" }
  );

  if (error) throw new Error(error.message);
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { responseId } = await context.params;
    const url = new URL(request.url);
    const pdiType = readPdiType(url);
    const shouldRegenerate = url.searchParams.get("regenerate") === "1";

    if (!responseId) return jsonError("Resposta não informada.", 400);

    const reportData = await loadLifenergyV1ReportData(responseId);

    if (shouldRegenerate && reportData.profile.role !== "super_admin") {
      return jsonError("A regeneração de PDI é restrita ao super usuário.", 403);
    }

    let pdiData: LifenergyPdiData;
    let content: LifenergyPdiGeneratedContent;
    let fileName = `PDI_Lifenergy_${reportData.response.full_name}.docx`;

    const stored = shouldRegenerate ? null : await findStoredPdi(responseId, pdiType);

    if (
      stored?.generated_content_json &&
      stored?.source_snapshot_json &&
      isLifenergyPdiGeneratedContent(stored.generated_content_json)
    ) {
      pdiData = stored.source_snapshot_json as LifenergyPdiData;
      content = stored.generated_content_json;
      fileName = stored.file_name || buildLifenergyPdiFileName(pdiData);
    } else {
      pdiData = await buildLifenergyPdiDataFromReportData(reportData, { pdiType });
      fileName = buildLifenergyPdiFileName(pdiData);
      const generated = await generateLifenergyPdiContent(pdiData);
      content = generated.content;

      await storePdi({ data: pdiData, content, model: generated.model, fileName });
    }

    const docx = buildLifenergyPdiDocx(pdiData, content);

    return new Response(docx as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": contentDispositionFileName(fileName),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao gerar PDI.";
    const status = message.includes("bloqueado") || message.includes("pendentes") ? 409 : 500;
    return jsonError(message, status);
  }
}
