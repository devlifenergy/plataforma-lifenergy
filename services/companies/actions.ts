"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";

type CompanyListItem = {
  id: string;
  name: string;
  status: string;
  created_at: string;
  profileId: string | null;
  authUserId: string | null;
  adminName: string;
  adminEmail: string;
};

async function requireSuperAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  if (error || profile?.role !== "super_admin") {
    throw new Error("Acesso não autorizado.");
  }
}

function normalizeEmail(value: FormDataEntryValue | null) {
  return String(value || "").trim().toLowerCase();
}

export async function listCompanies(): Promise<CompanyListItem[]> {
  await requireSuperAdmin();

  const admin = createAdminClient();

  const [
    { data: organizations, error: organizationsError },
    { data: profiles, error: profilesError },
  ] = await Promise.all([
    admin
      .from("organizations")
      .select("id, name, status, created_at")
      .order("created_at", { ascending: false }),
    admin
      .from("profiles")
      .select("id, organization_id, auth_user_id, name, email, role")
      .eq("role", "organization_admin"),
  ]);

  if (organizationsError) {
    throw new Error(organizationsError.message);
  }

  if (profilesError) {
    throw new Error(profilesError.message);
  }

  const adminByOrganization = new Map<
    string,
    {
      id: string;
      auth_user_id: string;
      name: string | null;
      email: string | null;
    }
  >();

  for (const profile of profiles ?? []) {
    if (profile.organization_id && !adminByOrganization.has(profile.organization_id)) {
      adminByOrganization.set(profile.organization_id, {
        id: profile.id,
        auth_user_id: profile.auth_user_id,
        name: profile.name,
        email: profile.email,
      });
    }
  }

  return (organizations ?? []).map((organization) => {
    const organizationAdmin = adminByOrganization.get(organization.id);

    return {
      id: organization.id,
      name: organization.name,
      status: organization.status,
      created_at: organization.created_at,
      profileId: organizationAdmin?.id ?? null,
      authUserId: organizationAdmin?.auth_user_id ?? null,
      adminName: organizationAdmin?.name ?? "",
      adminEmail: organizationAdmin?.email ?? "",
    };
  });
}

export async function createCompany(formData: FormData) {
  await requireSuperAdmin();

  const companyName = String(formData.get("company_name") || "").trim();
  const adminName = String(formData.get("admin_name") || "").trim();
  const adminEmail = normalizeEmail(formData.get("admin_email"));
  const password = String(formData.get("password") || "").trim();

  if (!companyName || !adminName || !adminEmail || !password) {
    throw new Error("Preencha todos os campos.");
  }

  const admin = createAdminClient();

  const { data: organization, error: organizationError } = await admin
    .from("organizations")
    .insert({
      name: companyName,
      status: "active",
    })
    .select("id")
    .single();

  if (organizationError || !organization) {
    throw new Error(organizationError?.message || "Erro ao criar empresa.");
  }

  const { data: authUser, error: authError } = await admin.auth.admin.createUser({
    email: adminEmail,
    password,
    email_confirm: true,
    user_metadata: {
      name: adminName,
      company: companyName,
    },
  });

  if (authError || !authUser.user) {
    await admin.from("organizations").delete().eq("id", organization.id);
    throw new Error(authError?.message || "Erro ao criar usuário.");
  }

  const { error: profileError } = await admin.from("profiles").insert({
    auth_user_id: authUser.user.id,
    organization_id: organization.id,
    name: adminName,
    email: adminEmail,
    role: "organization_admin",
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(authUser.user.id);
    await admin.from("organizations").delete().eq("id", organization.id);
    throw new Error(profileError.message);
  }

  revalidatePath("/painel/empresas");
}

export async function updateCompany(formData: FormData) {
  await requireSuperAdmin();

  const companyId = String(formData.get("company_id") || "").trim();
  const profileId = String(formData.get("profile_id") || "").trim();
  const authUserId = String(formData.get("auth_user_id") || "").trim();
  const companyName = String(formData.get("company_name") || "").trim();
  const adminName = String(formData.get("admin_name") || "").trim();
  const adminEmail = normalizeEmail(formData.get("admin_email"));
  const newPassword = String(formData.get("new_password") || "").trim();

  if (newPassword && newPassword.length < 6) {
    throw new Error("A nova senha deve ter no mínimo 6 caracteres.");
  }

  if (!companyId || !profileId || !authUserId || !companyName || !adminName || !adminEmail) {
    throw new Error("Preencha todos os campos da edição.");
  }

  const admin = createAdminClient();

  const [
    { data: currentOrganization, error: currentOrganizationError },
    { data: currentProfile, error: currentProfileError },
    { data: currentAuthData, error: currentAuthError },
  ] = await Promise.all([
    admin.from("organizations").select("id, name").eq("id", companyId).single(),
    admin
      .from("profiles")
      .select("id, organization_id, auth_user_id, name, email, role")
      .eq("id", profileId)
      .single(),
    admin.auth.admin.getUserById(authUserId),
  ]);

  if (currentOrganizationError || !currentOrganization) {
    throw new Error(currentOrganizationError?.message || "Empresa não encontrada.");
  }

  if (
    currentProfileError ||
    !currentProfile ||
    currentProfile.organization_id !== companyId ||
    currentProfile.auth_user_id !== authUserId ||
    currentProfile.role !== "organization_admin"
  ) {
    throw new Error(currentProfileError?.message || "Administrador da empresa não encontrado.");
  }

  if (currentAuthError || !currentAuthData.user) {
    throw new Error(currentAuthError?.message || "Usuário de autenticação não encontrado.");
  }

  const previousCompanyName = currentOrganization.name;
  const previousAdminName = currentProfile.name ?? "";
  const previousAdminEmail = currentProfile.email ?? currentAuthData.user.email ?? "";
  const previousMetadata = currentAuthData.user.user_metadata ?? {};

  const { error: organizationUpdateError } = await admin
    .from("organizations")
    .update({ name: companyName })
    .eq("id", companyId);

  if (organizationUpdateError) {
    throw new Error(organizationUpdateError.message);
  }

  const { error: profileUpdateError } = await admin
    .from("profiles")
    .update({
      name: adminName,
      email: adminEmail,
    })
    .eq("id", profileId)
    .eq("organization_id", companyId)
    .eq("auth_user_id", authUserId);

  if (profileUpdateError) {
    await admin
      .from("organizations")
      .update({ name: previousCompanyName })
      .eq("id", companyId);

    throw new Error(profileUpdateError.message);
  }

  const authUpdatePayload: {
    email: string;
    email_confirm: true;
    user_metadata: Record<string, unknown>;
    password?: string;
  } = {
    email: adminEmail,
    email_confirm: true,
    user_metadata: {
      ...previousMetadata,
      name: adminName,
      company: companyName,
    },
  };

  if (newPassword) {
    authUpdatePayload.password = newPassword;
  }

  const { error: authUpdateError } = await admin.auth.admin.updateUserById(
    authUserId,
    authUpdatePayload
  );

  if (authUpdateError) {
    await admin
      .from("organizations")
      .update({ name: previousCompanyName })
      .eq("id", companyId);

    await admin
      .from("profiles")
      .update({
        name: previousAdminName,
        email: previousAdminEmail,
      })
      .eq("id", profileId)
      .eq("organization_id", companyId)
      .eq("auth_user_id", authUserId);

    throw new Error(authUpdateError.message);
  }

  revalidatePath("/painel/empresas");
}

export async function toggleCompanyStatus(id: string, currentStatus: string) {
  await requireSuperAdmin();

  const admin = createAdminClient();
  const nextStatus = currentStatus === "active" ? "inactive" : "active";

  const { error } = await admin
    .from("organizations")
    .update({ status: nextStatus })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/painel/empresas");
}
