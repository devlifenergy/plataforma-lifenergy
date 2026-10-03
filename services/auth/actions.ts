"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";
import { isValidEmail } from "@/lib/validation";
import { getApplicationBaseUrl } from "@/services/email/lifenergyEmail";
import {
  LIFENERGY_COMPANY_TERMS_VERSION,
  LIFENERGY_PRIVACY_POLICY_VERSION,
} from "@/lib/legal";
import { logAuditEvent } from "@/services/audit/auditLog";

function redirectWithError(message: string): never {
  const query = new URLSearchParams({ error: message });
  redirect(`/login?${query.toString()}`);
}

function hasCurrentCompanyLegalAcceptance(profile: {
  company_terms_version?: string | null;
  company_privacy_policy_version?: string | null;
  company_terms_accepted_at?: string | null;
  company_privacy_accepted_at?: string | null;
}) {
  return (
    profile.company_terms_version === LIFENERGY_COMPANY_TERMS_VERSION &&
    profile.company_privacy_policy_version === LIFENERGY_PRIVACY_POLICY_VERSION &&
    Boolean(profile.company_terms_accepted_at) &&
    Boolean(profile.company_privacy_accepted_at)
  );
}


export async function identifyCompanyByEmail(email: string): Promise<{
  companyName: string | null;
}> {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail) {
    return { companyName: null };
  }

  const admin = createAdminClient();

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("organization_id, role")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (
    profileError ||
    !profile ||
    profile.role === "super_admin" ||
    !profile.organization_id
  ) {
    return { companyName: null };
  }

  const { data: organization, error: organizationError } = await admin
    .from("organizations")
    .select("name")
    .eq("id", profile.organization_id)
    .maybeSingle();

  if (organizationError || !organization) {
    return { companyName: null };
  }

  return { companyName: organization.name };
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirectWithError("Informe o e-mail e a senha.");
  }

  const supabase = await createClient();

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError || !signInData.user) {
    redirectWithError("E-mail ou senha inválidos.");
  }

  const admin = createAdminClient();

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role, organization_id, must_change_password, company_terms_accepted_at, company_terms_version, company_privacy_accepted_at, company_privacy_policy_version")
    .eq("auth_user_id", signInData.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    redirectWithError(
      "Não foi possível localizar o perfil deste usuário. Entre em contato com o administrador."
    );
  }

  if (profile.role !== "super_admin") {
    if (!profile.organization_id) {
      await supabase.auth.signOut();
      redirectWithError(
        "Este usuário não está vinculado a uma empresa. Entre em contato com o administrador."
      );
    }

    const { data: organization, error: organizationError } = await admin
      .from("organizations")
      .select("status")
      .eq("id", profile.organization_id)
      .single();

    if (organizationError || !organization) {
      await supabase.auth.signOut();
      redirectWithError(
        "Não foi possível localizar a empresa deste usuário. Entre em contato com o administrador."
      );
    }

    if (organization.status !== "active") {
      await supabase.auth.signOut();
      redirectWithError(
        "Esta empresa está temporariamente inativa. Entre em contato com o administrador."
      );
    }
  }

  if (profile.must_change_password) {
    redirect("/alterar-senha");
  }

  if (profile.role !== "super_admin" && !hasCurrentCompanyLegalAcceptance(profile)) {
    redirect("/aceite-legal");
  }

  redirect("/painel");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}


export async function acceptCompanyLegalTerms(formData: FormData) {
  const acceptedTerms = formData.get("accept_company_terms") === "on";
  const acceptedPrivacy = formData.get("accept_privacy_policy") === "on";

  if (!acceptedTerms || !acceptedPrivacy) {
    redirect("/aceite-legal?error=Para%20continuar%2C%20aceite%20os%20Termos%20de%20Uso%20e%20a%20Pol%C3%ADtica%20de%20Privacidade.");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const admin = createAdminClient();
  const acceptedAt = new Date().toISOString();

  const { data: profile } = await admin
    .from("profiles")
    .select("id, organization_id, name, email")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const { error } = await admin
    .from("profiles")
    .update({
      company_terms_accepted_at: acceptedAt,
      company_terms_version: LIFENERGY_COMPANY_TERMS_VERSION,
      company_privacy_accepted_at: acceptedAt,
      company_privacy_policy_version: LIFENERGY_PRIVACY_POLICY_VERSION,
    })
    .eq("auth_user_id", user.id);

  if (error) {
    redirect(`/aceite-legal?error=${encodeURIComponent(error.message)}`);
  }

  await logAuditEvent({
    action: "legal.company_acceptance",
    organizationId: (profile as any)?.organization_id ?? null,
    actorUserId: user.id,
    actorProfileId: (profile as any)?.id ?? null,
    actorName: (profile as any)?.name ?? null,
    actorEmail: (profile as any)?.email ?? user.email ?? null,
    entityType: "profile",
    entityId: (profile as any)?.id ?? user.id,
    description: "Usuário da empresa aceitou os Termos de Uso e a Política de Privacidade.",
    metadata: {
      company_terms_version: LIFENERGY_COMPANY_TERMS_VERSION,
      company_privacy_policy_version: LIFENERGY_PRIVACY_POLICY_VERSION,
    },
  });

  redirect("/painel");
}



export async function changeInitialPassword(formData: FormData) {
  const password = String(formData.get("password") || "");
  const confirmation = String(formData.get("password_confirmation") || "");
  if (password.length < 8) redirect("/alterar-senha?error=Use%20uma%20senha%20com%20pelo%20menos%208%20caracteres.");
  if (password !== confirmation) redirect("/alterar-senha?error=As%20senhas%20não%20coincidem.");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error: passwordError } = await supabase.auth.updateUser({ password });
  if (passwordError) redirect(`/alterar-senha?error=${encodeURIComponent(passwordError.message)}`);

  const admin = createAdminClient();
  const { error: profileError } = await admin.from("profiles").update({ must_change_password: false }).eq("auth_user_id", user.id);
  if (profileError) redirect(`/alterar-senha?error=${encodeURIComponent(profileError.message)}`);

  redirect("/painel");
}


export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    redirect("/esqueci-senha?error=Informe%20um%20e-mail%20válido.");
  }

  const appUrl = getApplicationBaseUrl();
  if (!appUrl) {
    redirect("/esqueci-senha?error=URL%20do%20sistema%20não%20configurada.");
  }

  const supabase = await createClient();
  const redirectTo = `${appUrl}/auth/callback?next=/alterar-senha`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    redirect(`/esqueci-senha?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Enviamos%20um%20link%20de%20redefinição%20para%20o%20e-mail%20informado.");
}
