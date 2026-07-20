"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";

function redirectWithError(message: string): never {
  const query = new URLSearchParams({ error: message });
  redirect(`/login?${query.toString()}`);
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
    .select("role, organization_id")
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

  redirect("/painel");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
