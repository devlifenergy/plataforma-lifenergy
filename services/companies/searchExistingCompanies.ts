"use server";

import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";

export type ExistingCompanySearchResult = {
  id: string;
  name: string;
  status: string;
  adminName: string;
  adminEmail: string;
  matchReason: string;
};

async function requireSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Usuário não autenticado.");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  if (error || profile?.role !== "super_admin") {
    throw new Error("Acesso não autorizado.");
  }
}

function cleanSearchValue(value: string) {
  return value.replace(/[%,()]/g, " ").replace(/\s+/g, " ").trim();
}

export async function searchExistingCompanies(rawQuery: string): Promise<ExistingCompanySearchResult[]> {
  await requireSuperAdmin();

  const query = cleanSearchValue(rawQuery);
  if (query.length < 2) return [];

  const admin = createAdminClient();

  const [{ data: organizations, error: organizationsError }, { data: matchedProfiles, error: profilesError }] = await Promise.all([
    admin
      .from("organizations")
      .select("id, name, status")
      .ilike("name", `%${query}%`)
      .order("name", { ascending: true })
      .limit(10),
    admin
      .from("profiles")
      .select("id, organization_id, name, email, role")
      .eq("role", "organization_admin")
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10),
  ]);

  if (organizationsError) throw new Error(organizationsError.message);
  if (profilesError) throw new Error(profilesError.message);

  const organizationIds = new Set<string>();
  for (const organization of organizations ?? []) organizationIds.add(organization.id);
  for (const profile of matchedProfiles ?? []) {
    if ((profile as any).organization_id) organizationIds.add((profile as any).organization_id);
  }

  if (organizationIds.size === 0) return [];

  const ids = Array.from(organizationIds).slice(0, 20);

  const [{ data: allOrganizations, error: allOrganizationsError }, { data: admins, error: adminsError }] = await Promise.all([
    admin
      .from("organizations")
      .select("id, name, status")
      .in("id", ids)
      .order("name", { ascending: true }),
    admin
      .from("profiles")
      .select("organization_id, name, email, role")
      .eq("role", "organization_admin")
      .in("organization_id", ids),
  ]);

  if (allOrganizationsError) throw new Error(allOrganizationsError.message);
  if (adminsError) throw new Error(adminsError.message);

  const adminByOrganization = new Map<string, { name: string; email: string }>();
  for (const profile of admins ?? []) {
    const organizationId = String((profile as any).organization_id ?? "");
    if (!organizationId || adminByOrganization.has(organizationId)) continue;
    adminByOrganization.set(organizationId, {
      name: String((profile as any).name ?? ""),
      email: String((profile as any).email ?? ""),
    });
  }

  const matchedByAdmin = new Set(
    (matchedProfiles ?? [])
      .map((profile: any) => String(profile.organization_id ?? ""))
      .filter(Boolean)
  );

  return (allOrganizations ?? []).slice(0, 10).map((organization: any) => {
    const adminProfile = adminByOrganization.get(organization.id);
    const matchedByCompanyName = String(organization.name ?? "").toLowerCase().includes(query.toLowerCase());

    return {
      id: organization.id,
      name: organization.name ?? "Empresa sem nome",
      status: organization.status ?? "-",
      adminName: adminProfile?.name || "Administrador não informado",
      adminEmail: adminProfile?.email || "E-mail não informado",
      matchReason: matchedByCompanyName
        ? "Nome da empresa"
        : matchedByAdmin.has(organization.id)
          ? "Usuário administrador"
          : "Dados semelhantes",
    };
  });
}
