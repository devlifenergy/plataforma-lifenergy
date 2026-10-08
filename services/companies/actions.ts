"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";
import { isValidEmail } from "@/lib/validation";
import { companyAccessEmail, companyPasswordUpdatedEmail, getApplicationBaseUrl, licensesAddedEmail, sendLifenergyEmail } from "@/services/email/lifenergyEmail";

type CompanyListItem = {
  id: string;
  name: string;
  status: string;
  created_at: string;
  licensesStartedAt: string | null;
  profileId: string | null;
  authUserId: string | null;
  adminName: string;
  adminEmail: string;
  licenseIndividualReports: number | null;
  licensePdiRelational: number | null;
  licensePdiCorporate: number | null;
  usedIndividualReports: number;
  usedPdiRelational: number;
  usedPdiCorporate: number;
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


type CompanyAuditAction = "company.created" | "company.updated" | "license.updated";

type CompanyAuditParams = {
  action: CompanyAuditAction;
  organizationId: string;
  organizationName: string | null;
  entityType?: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, unknown>;
};

async function readCompanyAuditActor(admin: ReturnType<typeof createAdminClient>) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await admin
      .from("profiles")
      .select("id, auth_user_id, name, email, role")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    return {
      actorUserId: user.id,
      actorProfileId: (profile as any)?.id ?? null,
      actorName: (profile as any)?.name ?? user.email ?? null,
      actorEmail: (profile as any)?.email ?? user.email ?? null,
    };
  } catch (error) {
    console.error("Falha ao identificar ator da auditoria de empresa:", error);
    return null;
  }
}

function extractClientIpFromHeaderValue(value: string | null) {
  if (!value) return null;

  const firstValue = value.split(",")[0]?.trim();
  if (!firstValue) return null;

  return firstValue
    .replace(/^for=/i, "")
    .replace(/^"|"$/g, "")
    .replace(/^\[|\]$/g, "")
    .trim() || null;
}

async function readCompanyAuditRequestContext() {
  try {
    const requestHeaders = await headers();
    const forwarded = requestHeaders.get("forwarded");
    const forwardedFor = requestHeaders.get("x-forwarded-for");
    const realIp = requestHeaders.get("x-real-ip");
    const vercelForwardedFor = requestHeaders.get("x-vercel-forwarded-for");
    const userAgent = requestHeaders.get("user-agent");

    let ipAddress =
      extractClientIpFromHeaderValue(vercelForwardedFor) ||
      extractClientIpFromHeaderValue(forwardedFor) ||
      extractClientIpFromHeaderValue(realIp);

    if (!ipAddress && forwarded) {
      const forwardedForPart = forwarded
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.toLowerCase().startsWith("for="));
      ipAddress = extractClientIpFromHeaderValue(forwardedForPart ?? null);
    }

    return {
      ipAddress,
      userAgent: userAgent || null,
    };
  } catch (error) {
    console.error("Falha ao ler IP/User-Agent da auditoria de empresa:", error);
    return {
      ipAddress: null,
      userAgent: null,
    };
  }
}

async function insertCompanyAuditLog(
  admin: ReturnType<typeof createAdminClient>,
  params: CompanyAuditParams
) {
  const [actor, requestContext] = await Promise.all([
    readCompanyAuditActor(admin),
    readCompanyAuditRequestContext(),
  ]);
  const entityType = params.entityType ?? "organization";
  const entityId = params.entityId ?? params.organizationId;
  const metadata = params.metadata ?? {};

  // Caminho principal: RPC com SECURITY DEFINER.
  // Motivo: em produção, a atualização da empresa acontecia, mas a auditoria
  // da tela Empresas não era gravada de forma confiável. A RPC centraliza a
  // gravação no banco e usa a sessão autenticada para identificar o ator.
  try {
    const supabase = await createClient();
    const { error: rpcError } = await supabase.rpc("lifenergy_insert_company_audit_log", {
      p_organization_id: params.organizationId,
      p_organization_name: params.organizationName,
      p_action: params.action,
      p_entity_type: entityType,
      p_entity_id: entityId,
      p_description: params.description,
      p_metadata: metadata,
      p_ip_address: requestContext.ipAddress,
      p_user_agent: requestContext.userAgent,
    });

    if (!rpcError) return;

    console.error("Falha ao registrar auditoria de empresa via RPC:", {
      action: params.action,
      organizationId: params.organizationId,
      organizationName: params.organizationName,
      error: rpcError,
    });
  } catch (error) {
    console.error("Falha inesperada na RPC de auditoria de empresa:", error);
  }

  // Fallback administrativo. Mantém compatibilidade com ambientes onde a
  // migration da RPC ainda não foi aplicada.
  const payload = {
    organization_id: params.organizationId,
    organization_name: params.organizationName,
    actor_profile_id: actor?.actorProfileId ?? null,
    actor_user_id: actor?.actorUserId ?? null,
    actor_name: actor?.actorName ?? null,
    actor_email: actor?.actorEmail ?? null,
    action: params.action,
    entity_type: entityType,
    entity_id: entityId,
    description: params.description,
    metadata,
    ip_address: requestContext.ipAddress,
    user_agent: requestContext.userAgent,
    // Compatibilidade com tabelas audit_logs criadas antes da 1.5.16.2.
    user_id: actor?.actorProfileId ?? null,
    entity: entityType,
  };

  const { error } = await admin.from("audit_logs").insert(payload);

  if (error) {
    console.error("Falha ao registrar auditoria de empresa pelo fallback administrativo:", {
      action: params.action,
      organizationId: params.organizationId,
      organizationName: params.organizationName,
      error,
    });
    // A auditoria não pode derrubar a operação de gestão de empresa.
    // O erro fica nos logs do Vercel para diagnóstico.
  }
}

async function countGeneratedReports(admin: ReturnType<typeof createAdminClient>, organizationId: string, startedAt: string | null) {
  const since = startedAt || new Date().toISOString();

  const { count, error } = await admin
    .from("generated_reports")
    .select("id", { head: true, count: "exact" })
    .eq("organization_id", organizationId)
    .eq("status", "generated")
    .gte("created_at", since);

  if (error) return 0;
  return count ?? 0;
}

async function countGeneratedPdis(
  admin: ReturnType<typeof createAdminClient>,
  organizationId: string,
  pdiType: "relational" | "corporate",
  startedAt: string | null
) {
  const since = startedAt || new Date().toISOString();

  const { count, error } = await admin
    .from("generated_pdis")
    .select("id", { head: true, count: "exact" })
    .eq("organization_id", organizationId)
    .eq("pdi_type", pdiType)
    .eq("status", "generated")
    .gte("created_at", since);

  if (error) return 0;
  return count ?? 0;
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
      .select("id, name, status, created_at, licenses_started_at, license_individual_reports, license_pdi_relational, license_pdi_corporate")
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

  return Promise.all(
    (organizations ?? []).map(async (organization) => {
      const organizationAdmin = adminByOrganization.get(organization.id);
      const licensesStartedAt = (organization as any).licenses_started_at ?? null;
      const [usedIndividualReports, usedPdiRelational, usedPdiCorporate] = await Promise.all([
        countGeneratedReports(admin, organization.id, licensesStartedAt),
        countGeneratedPdis(admin, organization.id, "relational", licensesStartedAt),
        countGeneratedPdis(admin, organization.id, "corporate", licensesStartedAt),
      ]);

      return {
        id: organization.id,
        name: organization.name,
        status: organization.status,
        created_at: organization.created_at,
        licensesStartedAt,
        profileId: organizationAdmin?.id ?? null,
        authUserId: organizationAdmin?.auth_user_id ?? null,
        adminName: organizationAdmin?.name ?? "",
        adminEmail: organizationAdmin?.email ?? "",
        licenseIndividualReports: (organization as any).license_individual_reports ?? null,
        licensePdiRelational: (organization as any).license_pdi_relational ?? null,
        licensePdiCorporate: (organization as any).license_pdi_corporate ?? null,
        usedIndividualReports,
        usedPdiRelational,
        usedPdiCorporate,
      };
    })
  );
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

  await insertCompanyAuditLog(admin, {
    action: "company.created",
    organizationId: organization.id,
    organizationName: companyName,
    entityType: "organization",
    entityId: organization.id,
    description: `Empresa criada: ${companyName}.`,
    metadata: {
      admin_name: adminName,
      admin_email: adminEmail,
      license_individual_reports: licenseIndividual,
      license_pdi_relational: licenseRelational,
      license_pdi_corporate: licenseCorporate,
      access_email_requested: sendAccessEmail,
      access_email_sent: emailSent,
    },
  });

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
    admin.from("organizations").select("id, name, license_individual_reports, license_pdi_relational, license_pdi_corporate, licenses_started_at").eq("id", companyId).single(),
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
  const previousLicenseIndividual = Number((currentOrganization as any).license_individual_reports ?? 0);
  const previousLicenseRelational = Number((currentOrganization as any).license_pdi_relational ?? 0);
  const previousLicenseCorporate = Number((currentOrganization as any).license_pdi_corporate ?? 0);
  const licensesIncreased =
    licenseIndividual > previousLicenseIndividual ||
    licenseRelational > previousLicenseRelational ||
    licenseCorporate > previousLicenseCorporate;

  const organizationUpdatePayload: Record<string, unknown> = {
    name: companyName,
    license_individual_reports: licenseIndividual,
    license_pdi_relational: licenseRelational,
    license_pdi_corporate: licenseCorporate,
  };

  if (licensesIncreased) {
    organizationUpdatePayload.licenses_started_at = new Date().toISOString();
  }

  const { error: organizationUpdateError } = await admin
    .from("organizations")
    .update(organizationUpdatePayload)
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
        licenses_started_at: (currentOrganization as any).licenses_started_at,
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
        licenses_started_at: (currentOrganization as any).licenses_started_at,
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
      { label: "Trilha Lifenergy", quantity: Math.max(0, licenseRelational - Number((currentOrganization as any).license_pdi_relational ?? 0)) },
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

  const companyProfileChanged =
    companyName !== previousCompanyName ||
    adminName !== previousAdminName ||
    adminEmail !== previousAdminEmail ||
    Boolean(newPassword);

  if (companyProfileChanged) {
    await insertCompanyAuditLog(admin, {
      action: "company.updated",
      organizationId: companyId,
      organizationName: companyName,
      entityType: "organization",
      entityId: companyId,
      description: `Empresa atualizada: ${companyName}.`,
      metadata: {
        previous_company_name: previousCompanyName,
        previous_admin_name: previousAdminName,
        previous_admin_email: previousAdminEmail,
        admin_name: adminName,
        admin_email: adminEmail,
        password_updated: Boolean(newPassword),
      },
    });
  }

  const licenseDeltaIndividual = licenseIndividual - previousLicenseIndividual;
  const licenseDeltaRelational = licenseRelational - previousLicenseRelational;
  const licenseDeltaCorporate = licenseCorporate - previousLicenseCorporate;
  const licenseChanged =
    licenseDeltaIndividual !== 0 ||
    licenseDeltaRelational !== 0 ||
    licenseDeltaCorporate !== 0;

  if (licenseChanged) {
    const hasIncrease = licenseDeltaIndividual > 0 || licenseDeltaRelational > 0 || licenseDeltaCorporate > 0;
    const hasReduction = licenseDeltaIndividual < 0 || licenseDeltaRelational < 0 || licenseDeltaCorporate < 0;
    const movementType = hasIncrease && hasReduction ? "ajuste_misto" : hasIncrease ? "aumento" : "reducao";

    await insertCompanyAuditLog(admin, {
      action: "license.updated",
      organizationId: companyId,
      organizationName: companyName,
      entityType: "organization",
      entityId: companyId,
      description: `Licenças atualizadas para ${companyName}. Movimento: ${movementType}.`,
      metadata: {
        movement_type: movementType,
        previous: {
          license_individual_reports: previousLicenseIndividual,
          license_pdi_relational: previousLicenseRelational,
          license_pdi_corporate: previousLicenseCorporate,
        },
        current: {
          license_individual_reports: licenseIndividual,
          license_pdi_relational: licenseRelational,
          license_pdi_corporate: licenseCorporate,
        },
        delta: {
          license_individual_reports: licenseDeltaIndividual,
          license_pdi_relational: licenseDeltaRelational,
          license_pdi_corporate: licenseDeltaCorporate,
        },
        notification_email_requested: notifyLicenseAddition,
      },
    });
  }

  revalidatePath("/painel/empresas");
}

export async function toggleCompanyStatus(id: string, currentStatus: string) {
  await requireSuperAdmin();

  const admin = createAdminClient();
  const nextStatus = currentStatus === "active" ? "inactive" : "active";

  const { data: organization } = await admin
    .from("organizations")
    .select("id, name")
    .eq("id", id)
    .maybeSingle();

  const { error } = await admin
    .from("organizations")
    .update({ status: nextStatus })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await insertCompanyAuditLog(admin, {
    action: "company.updated",
    organizationId: id,
    organizationName: (organization as any)?.name ?? null,
    entityType: "organization",
    entityId: id,
    description: `Status da empresa alterado para ${nextStatus}.`,
    metadata: {
      previous_status: currentStatus,
      next_status: nextStatus,
    },
  });

  revalidatePath("/painel/empresas");
}
