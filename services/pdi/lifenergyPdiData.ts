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
import type { LifenergyPdiData } from "./lifenergyPdiTypes";

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

export async function buildLifenergyPdiDataFromReportData(
  reportData: LifenergyV1ReportData
): Promise<LifenergyPdiData> {
  const safeReportData = stripPdiExcludedFields(reportData);
  const storedReport = await findStoredReport(reportData.response.id);

  if (storedReport) {
    return {
      reportData: safeReportData,
      reportContent: storedReport.generated_content_json,
      sourceReportId: storedReport.id,
    };
  }

  const generated = await generateLifenergyV1Content(reportData);

  return {
    reportData: safeReportData,
    reportContent: generated.content,
    sourceReportId: null,
  };
}

export async function loadLifenergyPdiData(responseId: string): Promise<LifenergyPdiData> {
  const reportData = await loadLifenergyV1ReportData(responseId);
  return buildLifenergyPdiDataFromReportData(reportData);
}
