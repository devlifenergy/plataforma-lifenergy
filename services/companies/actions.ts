"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";
import { isValidEmail } from "@/lib/validation";
import { companyAccessEmail, companyPasswordUpdatedEmail, getApplicationBaseUrl, licensesAddedEmail, sendLifenergyEmail } from "@/services/email/lifenergyEmail";

type CompanyListItem = {
  id: string;
  name: string;
  status: string;
  created_at: string;
  profileId: string | null;
  authUserId: string | null;
  adminName: string;
  adminEmail: string;
  licenseIndividualReports: number | null;
  licensePdiRelational: number | null;
  licensePdiCorporate: number | null;
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

function isAuthUserAlreadyExistsMessage(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("already registered") ||
    normalized.includes("already been registered") ||
    normalized.includes("already exists") ||
    normalized.includes("user already")
  );
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
      .select("id, name, status, created_at, license_individual_reports, license_pdi_relational, license_pdi_corporate")
      .order("created_at", { ascending: false }),
    admin
      .from("profiles")
      .select("id, organization_id, auth_user_id, name, email, role, must_change_password")
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
      licenseIndividualReports: (organization as any).license_individual_reports ?? null,
      licensePdiRelational: (organization as any).license_pdi_relational ?? null,
      licensePdiCorporate: (organization as any).license_pdi_corporate ?? null,
    };
  });
}

export async function createCompany(formData: FormData) {
  await requireSuperAdmin();

  const companyName = String(formData.get("company_name") || "").trim();
  const adminName = String(formData.get("admin_name") || "").trim();
  const adminEmail = normalizeEmail(formData.get("admin_email"));
  const password = String(formData.get("password") || "");
  const licenseIndividual = Number(formData.get("license_individual_reports"));
  const licenseRelational = Number(formData.get("license_pdi_relational"));
  const licenseCorporate = Number(formData.get("license_pdi_corporate"));
  const sendAccessEmail = formData.get("send_access_email") === "on";

  if (!companyName || !adminName || !adminEmail || !password) {
    throw new Error("Preencha todos os campos.");
  }
  if (!isValidEmail(adminEmail)) throw new Error("Informe um e-mail válido para o administrador.");
  if (![licenseIndividual, licenseRelational, licenseCorporate].every((value) => Number.isInteger(value) && value >= 0)) {
    throw new Error("Informe quantidades válidas de licenças.");
  }

  if (password.length < 6) {
    throw new Error("A senha inicial deve ter no mínimo 6 caracteres.");
  }

  const admin = createAdminClient();

  const { data: existingProfile, error: existingProfileError } = await admin
    .from("profiles")
    .select("id, auth_user_id, email, role")
    .eq("email", adminEmail)
    .maybeSingle();

  if (existingProfileError) {
    throw new Error(existingProfileError.message);
  }

  if (existingProfile) {
    throw new Error(
      "Este e-mail já está vinculado a um usuário da plataforma. Use outro e-mail ou edite a empresa existente."
    );
  }

  /*
   * Ordem corrigida:
   * 1. cria o usuário no Supabase Auth;
   * 2. cria a empresa;
   * 3. cria o profile organization_admin.
   *
   * Antes, a empresa podia ficar gravada sem administrador quando alguma etapa
   * posterior falhava no Sandbox. Isso causava a mensagem:
   * "Esta empresa não possui um administrador vinculado...".
   */
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
    const message = authError?.message || "Erro ao criar usuário.";

    if (isAuthUserAlreadyExistsMessage(message)) {
      throw new Error(
        "Este e-mail já existe no Authentication do Supabase, mas não está vinculado corretamente a uma empresa. No Sandbox, apague esse usuário em Authentication > Users ou use outro e-mail de teste."
      );
    }

    throw new Error(message);
  }

  const { data: organization, error: organizationError } = await admin
    .from("organizations")
    .insert({
      name: companyName,
      status: "active",
      license_individual_reports: licenseIndividual,
      license_pdi_relational: licenseRelational,
      license_pdi_corporate: licenseCorporate,
    })
    .select("id")
    .single();

  if (organizationError || !organization) {
    await admin.auth.admin.deleteUser(authUser.user.id);
    throw new Error(organizationError?.message || "Erro ao criar empresa.");
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: authUser.user.id,
    auth_user_id: authUser.user.id,
    organization_id: organization.id,
    name: adminName,
    email: adminEmail,
    role: "organization_admin",
    must_change_password: true,
  });

  if (profileError) {
    await admin.from("organizations").delete().eq("id", organization.id);
    await admin.auth.admin.deleteUser(authUser.user.id);
    throw new Error(profileError.message);
  }

  let emailSent = false;
  let emailWarning: string | null = null;
  if (sendAccessEmail) {
    const appUrl = getApplicationBaseUrl();
    if (!appUrl) {
      emailWarning = "Configure LIFENERGY_APP_URL para enviar o e-mail de acesso.";
    } else {
      try {
        const template = companyAccessEmail({ companyName, adminName, email: adminEmail, temporaryPassword: password, loginUrl: `${appUrl}/login` });
        const emailResult = await sendLifenergyEmail({ to: adminEmail, ...template });
        emailSent = emailResult.sent;
        if (!emailResult.sent) emailWarning = emailResult.reason;
      } catch (error) {
        emailWarning = error instanceof Error ? error.message : "Não foi possível enviar o e-mail de acesso.";
      }
    }
  }

  revalidatePath("/painel/empresas");
  return { emailSent, emailWarning, emailRequested: sendAccessEmail };
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
  const licenseIndividual = Number(formData.get("license_individual_reports"));
  const licenseRelational = Number(formData.get("license_pdi_relational"));
  const licenseCorporate = Number(formData.get("license_pdi_corporate"));
  const notifyLicenseAddition = formData.get("notify_license_addition") === "on";
  const sendPasswordEmail = formData.get("send_password_email") === "on";

  if (newPassword && newPassword.length < 6) {
    throw new Error("A nova senha deve ter no mínimo 6 caracteres.");
  }

  if (!companyId || !profileId || !authUserId || !companyName || !adminName || !adminEmail) {
    throw new Error("Preencha todos os campos da edição.");
  }
  if (!isValidEmail(adminEmail)) throw new Error("Informe um e-mail válido para o administrador.");
  if (![licenseIndividual, licenseRelational, licenseCorporate].every((value) => Number.isInteger(value) && value >= 0)) {
    throw new Error("Informe quantidades válidas de licenças.");
  }

  const admin = createAdminClient();

  const [
    { data: currentOrganization, error: currentOrganizationError },
    { data: currentProfile, error: currentProfileError },
    { data: currentAuthData, error: currentAuthError },
  ] = await Promise.all([
    admin.from("organizations").select("id, name, license_individual_reports, license_pdi_relational, license_pdi_corporate").eq("id", companyId).single(),
    admin
      .from("profiles")
      .select("id, organization_id, auth_user_id, name, email, role, must_change_password")
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
  const previousMustChangePassword = Boolean((currentProfile as any).must_change_password);
  const previousMetadata = currentAuthData.user.user_metadata ?? {};

  const { error: organizationUpdateError } = await admin
    .from("organizations")
    .update({
      name: companyName,
      license_individual_reports: licenseIndividual,
      license_pdi_relational: licenseRelational,
      license_pdi_corporate: licenseCorporate,
    })
    .eq("id", companyId);

  if (organizationUpdateError) {
    throw new Error(organizationUpdateError.message);
  }

  const profileUpdatePayload: {
    name: string;
    email: string;
    must_change_password?: boolean;
  } = {
    name: adminName,
    email: adminEmail,
  };

  if (newPassword) {
    profileUpdatePayload.must_change_password = true;
  }

  const { error: profileUpdateError } = await admin
    .from("profiles")
    .update(profileUpdatePayload)
    .eq("id", profileId)
    .eq("organization_id", companyId)
    .eq("auth_user_id", authUserId);

  if (profileUpdateError) {
    await admin
      .from("organizations")
      .update({
        name: previousCompanyName,
        license_individual_reports: (currentOrganization as any).license_individual_reports,
        license_pdi_relational: (currentOrganization as any).license_pdi_relational,
        license_pdi_corporate: (currentOrganization as any).license_pdi_corporate,
      })
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
      .update({
        name: previousCompanyName,
        license_individual_reports: (currentOrganization as any).license_individual_reports,
        license_pdi_relational: (currentOrganization as any).license_pdi_relational,
        license_pdi_corporate: (currentOrganization as any).license_pdi_corporate,
      })
      .eq("id", companyId);

    await admin
      .from("profiles")
      .update({
        name: previousAdminName,
        email: previousAdminEmail,
        must_change_password: previousMustChangePassword,
      })
      .eq("id", profileId)
      .eq("organization_id", companyId)
      .eq("auth_user_id", authUserId);

    throw new Error(authUpdateError.message);
  }

  if (newPassword && sendPasswordEmail) {
    const appUrl = getApplicationBaseUrl();
    if (appUrl) {
      try {
        const template = companyPasswordUpdatedEmail({
          companyName,
          adminName,
          email: adminEmail,
          temporaryPassword: newPassword,
          loginUrl: `${appUrl}/login`,
        });
        await sendLifenergyEmail({ to: adminEmail, ...template });
      } catch (error) {
        console.error("Falha ao enviar nova senha da empresa:", error);
      }
    }
  }

  if (notifyLicenseAddition) {
    const additions = [
      { label: "Relatório Individual/Relacional", quantity: Math.max(0, licenseIndividual - Number((currentOrganization as any).license_individual_reports ?? 0)) },
      { label: "PDI Relacional", quantity: Math.max(0, licenseRelational - Number((currentOrganization as any).license_pdi_relational ?? 0)) },
      { label: "PDI Corporativo", quantity: Math.max(0, licenseCorporate - Number((currentOrganization as any).license_pdi_corporate ?? 0)) },
    ].filter((item) => item.quantity > 0);

    if (additions.length > 0) {
      const appUrl = getApplicationBaseUrl();
      if (appUrl) {
        try {
          const template = licensesAddedEmail({ companyName, additions, loginUrl: `${appUrl}/login` });
          await sendLifenergyEmail({ to: adminEmail, ...template });
        } catch (error) {
          console.error("Falha ao notificar adição de licenças:", error);
        }
      }
    }
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
