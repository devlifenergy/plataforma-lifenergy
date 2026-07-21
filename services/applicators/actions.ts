"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabaseServer";

async function getCurrentProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, organization_id")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !profile?.organization_id) {
    throw new Error("Perfil da empresa não encontrado.");
  }

  return { supabase, profile };
}

function normalizeOptionalField(value: FormDataEntryValue | null) {
  const normalized = String(value || "").trim();
  return normalized || null;
}

export async function listApplicators() {
  const { supabase, profile } = await getCurrentProfile();

  const { data, error } = await supabase
    .from("applicators")
    .select("id, name, email, phone, active, created_at")
    .eq("organization_id", profile.organization_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createApplicator(formData: FormData) {
  const { supabase, profile } = await getCurrentProfile();

  const name = String(formData.get("name") || "").trim();
  const email = normalizeOptionalField(formData.get("email"));
  const phone = normalizeOptionalField(formData.get("phone"));

  if (!name) {
    throw new Error("Nome do aplicador é obrigatório.");
  }

  const { error } = await supabase.from("applicators").insert({
    organization_id: profile.organization_id,
    name,
    email,
    phone,
    active: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/painel/aplicadores");
}

export async function updateApplicator(formData: FormData) {
  const { supabase, profile } = await getCurrentProfile();

  const applicatorId = String(
    formData.get("applicator_id") || ""
  ).trim();
  const name = String(formData.get("name") || "").trim();
  const email = normalizeOptionalField(formData.get("email"));
  const phone = normalizeOptionalField(formData.get("phone"));

  if (!applicatorId || !name) {
    throw new Error("Informe o aplicador e o nome.");
  }

  const { error } = await supabase
    .from("applicators")
    .update({
      name,
      email,
      phone,
    })
    .eq("id", applicatorId)
    .eq("organization_id", profile.organization_id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/painel/aplicadores");
}

export async function toggleApplicatorStatus(
  applicatorId: string,
  currentStatus: boolean
) {
  const { supabase, profile } = await getCurrentProfile();

  const { error } = await supabase
    .from("applicators")
    .update({
      active: !currentStatus,
    })
    .eq("id", applicatorId)
    .eq("organization_id", profile.organization_id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/painel/aplicadores");
}
