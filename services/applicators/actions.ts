"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabaseServer";

async function getCurrentProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Usuario nao autenticado.");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, organization_id")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !profile?.organization_id) {
    throw new Error("Perfil da empresa nao encontrado.");
  }

  return { supabase, profile };
}

export async function listApplicators() {
  const { supabase, profile } = await getCurrentProfile();

  const { data, error } = await supabase
    .from("applicators")
    .select("id, name, email, phone, active, created_at")
    .eq("organization_id", profile.organization_id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function createApplicator(formData: FormData) {
  const { supabase, profile } = await getCurrentProfile();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim() || null;
  const phone = String(formData.get("phone") || "").trim() || null;

  if (!name) throw new Error("Nome do aplicador e obrigatorio.");

  const { error } = await supabase.from("applicators").insert({
    organization_id: profile.organization_id,
    name,
    email,
    phone,
    active: true,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/painel/aplicadores");
}