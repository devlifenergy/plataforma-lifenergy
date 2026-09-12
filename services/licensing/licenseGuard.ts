import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";

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

export type LicenseBalance = {
  contracted: number;
  used: number;
  available: number;
};

export type OrganizationLicenseSummary = {
  individualReport: LicenseBalance;
  pdiRelational: LicenseBalance;
  pdiCorporate: LicenseBalance;
  startedAt: string | null;
};

async function loadOrganizationLicenseRecord(organizationId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("organizations")
    .select("id, license_individual_reports, license_pdi_relational, license_pdi_corporate, licenses_started_at")
    .eq("id", organizationId)
    .single();

  if (error || !data) throw new Error("Licenciamento da empresa não encontrado.");
  return data as unknown as OrganizationLicenseRecord;
}

async function countUsedLicenses(organizationId: string, kind: LicenseKind, startedAt: string | null) {
  const admin = createAdminClient();
  const since = startedAt || new Date().toISOString();

  if (kind === "individual_report") {
    const { count, error } = await admin
      .from("generated_reports")
      .select("id", { head: true, count: "exact" })
      .eq("organization_id", organizationId)
      .eq("status", "generated")
      .gte("created_at", since);
    if (error) throw new Error(error.message);
    return count ?? 0;
  }

  const pdiType = kind === "pdi_corporate" ? "corporate" : "relational";
  const { count, error } = await admin
    .from("generated_pdis")
    .select("id", { head: true, count: "exact" })
    .eq("organization_id", organizationId)
    .eq("pdi_type", pdiType)
    .eq("status", "generated")
    .gte("created_at", since);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

function balance(contractedValue: number | null | undefined, used: number): LicenseBalance {
  const contracted = Math.max(0, Number(contractedValue ?? 0));
  return {
    contracted,
    used,
    available: Math.max(contracted - used, 0),
  };
}

export async function getOrganizationLicenseSummary(organizationId: string): Promise<OrganizationLicenseSummary> {
  const organization = await loadOrganizationLicenseRecord(organizationId);
  const [individualUsed, relationalUsed, corporateUsed] = await Promise.all([
    countUsedLicenses(organizationId, "individual_report", organization.licenses_started_at),
    countUsedLicenses(organizationId, "pdi_relational", organization.licenses_started_at),
    countUsedLicenses(organizationId, "pdi_corporate", organization.licenses_started_at),
  ]);

  return {
    individualReport: balance(organization.license_individual_reports, individualUsed),
    pdiRelational: balance(organization.license_pdi_relational, relationalUsed),
    pdiCorporate: balance(organization.license_pdi_corporate, corporateUsed),
    startedAt: organization.licenses_started_at,
  };
}

export async function getCurrentOrganizationLicenseSummary() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado.");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("auth_user_id", user.id)
    .single();
  if (error || !profile?.organization_id) throw new Error("Perfil da empresa não encontrado.");

  return getOrganizationLicenseSummary(profile.organization_id);
}

export async function assertLicenseAvailable(params: {
  organizationId: string;
  kind: LicenseKind;
  responseId: string;
}) {
  const organization = await loadOrganizationLicenseRecord(params.organizationId);
  const licenseColumn = columnByKind[params.kind];
  const limit = Math.max(0, Number(organization[licenseColumn] ?? 0));
  const used = await countUsedLicenses(params.organizationId, params.kind, organization.licenses_started_at);

  if (used >= limit) {
    const label = params.kind === "individual_report"
      ? "Relatório Individual"
      : params.kind === "pdi_relational"
        ? "PDI Relacional"
        : "PDI Corporativo";
    throw new Error(`Licença esgotada para ${label}. Solicite novas licenças ao administrador.`);
  }
}
