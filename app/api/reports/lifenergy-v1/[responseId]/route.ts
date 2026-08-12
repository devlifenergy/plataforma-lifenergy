import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseAdmin";
import {
  generateLifenergyV1Content,
  isLifenergyV1GeneratedContent,
} from "@/services/reports/lifenergyV1AI";
import {
  buildLifenergyReportFileName,
  buildLifenergyV1Docx,
} from "@/services/reports/lifenergyV1Docx";
import { loadLifenergyV1ReportData } from "@/services/reports/lifenergyV1Data";
import type { LifenergyV1GeneratedContent, LifenergyV1ReportData } from "@/services/reports/lifenergyV1Types";
import {
  LIFENERGY_REPORT_ENGINE_VERSION,
  LIFENERGY_REPORT_FORMAT,
  LIFENERGY_REPORT_PROMPT_VERSION,
  LIFENERGY_REPORT_TEMPLATE_VERSION,
  LIFENERGY_REPORT_VERSION,
} from "@/services/reports/lifenergyV1Types";

type RouteContext = {
  params: Promise<{
    responseId: string;
  }>;
};

function contentDispositionFileName(fileName: string) {
  const safeFallback = fileName.replace(/[^a-zA-Z0-9_.-]+/g, "_");
  return `attachment; filename="${safeFallback}"; filename*=UTF-8''${encodeURIComponent(
    fileName
  )}`;
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function findStoredReport(responseId: string) {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("generated_reports")
    .select(
      "id, source_snapshot_json, generated_content_json, file_name, engine_version, prompt_version, template_version"
    )
    .eq("journey_response_id", responseId)
    .eq("report_version", LIFENERGY_REPORT_VERSION)
    .eq("format", LIFENERGY_REPORT_FORMAT)
    .eq("status", "generated")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function storeReport(params: {
  data: LifenergyV1ReportData;
  content: LifenergyV1GeneratedContent;
  model: string;
  fileName: string;
}) {
  const admin = createAdminClient();

  const { error } = await admin.from("generated_reports").upsert(
    {
      organization_id: params.data.organization.id,
      journey_id: params.data.journey.id,
      journey_response_id: params.data.response.id,
      report_version: LIFENERGY_REPORT_VERSION,
      format: LIFENERGY_REPORT_FORMAT,
      status: "generated",
      generated_by: params.data.profile.id,
      model: params.model,
      engine_version: LIFENERGY_REPORT_ENGINE_VERSION,
      prompt_version: LIFENERGY_REPORT_PROMPT_VERSION,
      template_version: LIFENERGY_REPORT_TEMPLATE_VERSION,
      source_snapshot_json: params.data,
      generated_content_json: params.content,
      file_name: params.fileName,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "journey_response_id,report_version,format",
    }
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { responseId } = await context.params;
    const url = new URL(request.url);
    const shouldRegenerate = url.searchParams.get("regenerate") === "1";

    if (!responseId) {
      return jsonError("Resposta não informada.", 400);
    }

    const reportData = await loadLifenergyV1ReportData(responseId);

    if (shouldRegenerate && reportData.profile.role !== "super_admin") {
      return jsonError("A regeneração de relatório é restrita ao super usuário.", 403);
    }

    let fileName = buildLifenergyReportFileName(reportData);
    let content: LifenergyV1GeneratedContent;
    let sourceSnapshot: LifenergyV1ReportData = reportData;

    const stored = shouldRegenerate ? null : await findStoredReport(responseId);

    if (
      stored?.generated_content_json &&
      stored?.source_snapshot_json &&
      isLifenergyV1GeneratedContent(stored.generated_content_json)
    ) {
      content = stored.generated_content_json;
      sourceSnapshot = stored.source_snapshot_json as LifenergyV1ReportData;
      fileName = stored.file_name || buildLifenergyReportFileName(sourceSnapshot);
    } else {
      const generated = await generateLifenergyV1Content(reportData);
      content = generated.content;
      await storeReport({
        data: reportData,
        content,
        model: generated.model,
        fileName,
      });
    }

    const docx = buildLifenergyV1Docx(sourceSnapshot, content);

    return new Response(docx as unknown as BodyInit, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": contentDispositionFileName(fileName),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao gerar relatório.";
    return jsonError(message, 500);
  }
}
