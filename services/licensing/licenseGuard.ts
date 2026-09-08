import { createAdminClient } from "@/lib/supabaseAdmin";

export type LicenseKind = "individual_report" | "pdi_relational" | "pdi_corporate";

const columnByKind: Record<LicenseKind, keyof OrganizationLicenseRecord> = {
  individual_report: "license_individual_reports",
  pdi_relational: "license_pdi_relational",
  pdi_corporate: "license_pdi_corporate",
};

type OrganizationLicenseRecord = {
  id: string;
  license_individual_reports: number | null;
  license_pdi_relational: number | null;
  license_pdi_corporate: number | null;
  licenses_started_at: string | null;
};

export async function assertLicenseAvailable(params: {
  organizationId: string;
  kind: LicenseKind;
  responseId: string;
}) {
  const admin = createAdminClient();
  const licenseColumn = columnByKind[params.kind];

  const { data: organization, error: organizationError } = await admin
    .from("organizations")
    .select("id, license_individual_reports, license_pdi_relational, license_pdi_corporate, licenses_started_at")
    .eq("id", params.organizationId)
    .single();

  if (organizationError || !organization) throw new Error("Licenciamento da empresa não encontrado.");
  const organizationRecord = organization as unknown as OrganizationLicenseRecord;
  const limit = organizationRecord[licenseColumn];
  const startedAt = organizationRecord.licenses_started_at || "";
  if (limit === null || limit === undefined) return;

  let used = 0;
  if (params.kind === "individual_report") {
    const { count, error } = await admin
      .from("generated_reports")
      .select("id", { head: true, count: "exact" })
      .eq("organization_id", params.organizationId)
      .eq("status", "generated")
      .gte("created_at", startedAt || "1970-01-01T00:00:00Z");
    if (error) throw new Error(error.message);
    used = count ?? 0;
  } else {
    const pdiType = params.kind === "pdi_corporate" ? "corporate" : "relational";
    const { count, error } = await admin
      .from("generated_pdis")
      .select("id", { head: true, count: "exact" })
      .eq("organization_id", params.organizationId)
      .eq("pdi_type", pdiType)
      .eq("status", "generated")
      .gte("created_at", startedAt || "1970-01-01T00:00:00Z");
    if (error) throw new Error(error.message);
    used = count ?? 0;
  }

  if (used >= Number(limit)) {
    const label = params.kind === "individual_report"
      ? "Relatório Individual"
      : params.kind === "pdi_relational"
        ? "PDI Relacional"
        : "PDI Corporativo";
    throw new Error(`Licença esgotada para ${label}. Solicite novas licenças ao administrador.`);
  }
}
