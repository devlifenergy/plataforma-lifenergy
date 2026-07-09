"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";

async function requireSuperAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuario nao autenticado.");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  if (error || profile?.role !== "super_admin") {
    throw new Error("Acesso nao autorizado.");
  }
}

export async function listCompanies() {
  await requireSuperAdmin();

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("organizations")
    .select("id, name, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createCompany(formData: FormData) {
  await requireSuperAdmin();

  const companyName = String(formData.get("company_name") || "").trim();
  const adminName = String(formData.get("admin_name") || "").trim();
  const adminEmail = String(formData.get("admin_email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!companyName || !adminName || !adminEmail || !password) {
    throw new Error("Preencha todos os campos.");
  }

  const admin = createAdminClient();

  const supabase = await createClient();

const { data: org, error: orgError } = await supabase
  .from("organizations")
  .insert({
    name: companyName,
    status: "active",
  })
  .select("id")
  .single();

  if (orgError || !org) {
    throw new Error(orgError?.message || "Erro ao criar empresa.");
  }

  const { data: authUser, error: authError } =
    await admin.auth.admin.createUser({
      email: adminEmail,
      password,
      email_confirm: true,
      user_metadata: {
        name: adminName,
        company: companyName,
      },
    });

  if (authError || !authUser.user) {
    await admin.from("organizations").delete().eq("id", org.id);
    throw new Error(authError?.message || "Erro ao criar usuario.");
  }

  const { error: profileError } = await admin.from("profiles").insert({
    auth_user_id: authUser.user.id,
    organization_id: org.id,
    name: adminName,
    email: adminEmail,
    role: "organization_admin",
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(authUser.user.id);
    await admin.from("organizations").delete().eq("id", org.id);
    throw new Error(profileError.message);
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
