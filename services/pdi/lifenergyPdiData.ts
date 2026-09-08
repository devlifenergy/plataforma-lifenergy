import { createAdminClient } from "@/lib/supabaseAdmin";
import {
  generateLifenergyV1Content,
  isLifenergyV1GeneratedContent,
} from "@/services/reports/lifenergyV1AI";
import { loadLifenergyV1ReportData } from "@/services/reports/lifenergyV1Data";
import {
  LIFENERGY_REPORT_FORMAT,
  LIFENERGY_REPORT_VERSION,
  type LifenergyV1GeneratedContent,
  type LifenergyV1ReportData,
} from "@/services/reports/lifenergyV1Types";
import { loadPdiContextAndCorporateKnowledge } from "./corporateKnowledge";
import type { LifenergyPdiData, LifenergyPdiType } from "./lifenergyPdiTypes";

async function findStoredReport(responseId: string): Promise<{
  id: string;
  generated_content_json: LifenergyV1GeneratedContent;
} | null> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("generated_reports")
    .select("id, generated_content_json")
    .eq("journey_response_id", responseId)
    .eq("report_version", LIFENERGY_REPORT_VERSION)
    .eq("format", LIFENERGY_REPORT_FORMAT)
    .eq("status", "generated")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.generated_content_json || !isLifenergyV1GeneratedContent(data.generated_content_json)) {
    return null;
  }

  return {
    id: data.id,
    generated_content_json: data.generated_content_json,
  };
}

function stripPdiExcludedFields(reportData: LifenergyV1ReportData): LifenergyV1ReportData {
  const response = reportData.response as typeof reportData.response & {
    participation_objective?: string;
    participationObjective?: string;
    "Objetivo de participação"?: string;
  };

  const {
    participation_objective: _participationObjective,
    participationObjective: _participationObjectiveCamel,
    "Objetivo de participação": _participationObjectiveLabel,
    ...safeResponse
  } = response;

  return {
    ...reportData,
    response: safeResponse as typeof reportData.response,
    fractals: reportData.fractals.map((fractal) => {
      const { finalFeeling: _finalFeeling, final_feeling: _finalFeelingSnake, ...safeFractal } =
        fractal as typeof fractal & {
          finalFeeling?: string;
          final_feeling?: string;
        };

      return safeFractal;
    }),
  };
}


async function loadRelatedEvaluations(reportData: LifenergyV1ReportData, pdiType: LifenergyPdiType) {
  if (pdiType !== "corporate") return [];
  const admin = createAdminClient();
  const { data: relatedResponses, error } = await admin
    .from("journey_responses")
    .select("id, application_date")
    .eq("organization_id", reportData.organization.id)
    .eq("cpf", reportData.response.cpf)
    .neq("id", reportData.response.id)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw new Error(error.message);
  if (!relatedResponses?.length) return [];

  return Promise.all(relatedResponses.map(async (response) => {
    const relatedReportData = stripPdiExcludedFields(await loadLifenergyV1ReportData(response.id));
    const stored = await findStoredReport(response.id);
    return {
      responseId: response.id,
      applicationDate: response.application_date || relatedReportData.response.application_date,
      reportData: {
        response: relatedReportData.response,
        fractals: relatedReportData.fractals,
        journey: relatedReportData.journey,
      },
      reportContent: stored?.generated_content_json ?? null,
    };
  }));
}
export async function buildLifenergyPdiDataFromReportData(
  reportData: LifenergyV1ReportData,
  options?: { pdiType?: LifenergyPdiType }
): Promise<LifenergyPdiData> {
  const pdiType = options?.pdiType ?? "relational";
  const safeReportData = stripPdiExcludedFields(reportData);
  const [storedReport, contextAndKnowledge, relatedEvaluations] = await Promise.all([
    findStoredReport(reportData.response.id),
    loadPdiContextAndCorporateKnowledge({
      organizationId: reportData.organization.id,
      responseId: reportData.response.id,
      pdiType,
    }),
    loadRelatedEvaluations(reportData, pdiType),
  ]);

  if (storedReport) {
    return {
      pdiType,
      pdiContext: contextAndKnowledge.pdiContext,
      corporateDocuments: contextAndKnowledge.corporateDocuments,
      reportData: safeReportData,
      reportContent: storedReport.generated_content_json,
      sourceReportId: storedReport.id,
      relatedEvaluations,
    };
  }

  const generated = await generateLifenergyV1Content(reportData);

  return {
    pdiType,
    pdiContext: contextAndKnowledge.pdiContext,
    corporateDocuments: contextAndKnowledge.corporateDocuments,
    reportData: safeReportData,
    reportContent: generated.content,
    sourceReportId: null,
    relatedEvaluations,
  };
}

export async function loadLifenergyPdiData(
  responseId: string,
  options?: { pdiType?: LifenergyPdiType }
): Promise<LifenergyPdiData> {
  const reportData = await loadLifenergyV1ReportData(responseId);
  return buildLifenergyPdiDataFromReportData(reportData, options);
}
