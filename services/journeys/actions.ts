"use server";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabaseServer";

function generateToken() {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
}

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

export async function listJourneys() {
  const { supabase, profile } = await getCurrentProfile();

  const { data, error } = await supabase
    .from("journeys")
    .select("id, code, token, participant_name, participant_email, status, created_at, applicators(name)")
    .eq("organization_id", profile.organization_id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function listActiveApplicators() {
  const { supabase, profile } = await getCurrentProfile();

  const { data, error } = await supabase
    .from("applicators")
    .select("id, name")
    .eq("organization_id", profile.organization_id)
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function createJourney(formData: FormData) {
  const { supabase, profile } = await getCurrentProfile();

  const applicatorId = String(formData.get("applicator_id") || "");
  const participantName = String(formData.get("participant_name") || "").trim();
  const participantEmail =
    String(formData.get("participant_email") || "").trim() || null;

  if (!applicatorId) throw new Error("Aplicador obrigatorio.");
  if (!participantName) throw new Error("Nome do entrevistado obrigatorio.");

  const uniqueId = randomUUID().replaceAll("-", "").toUpperCase();

const code = `LFE-${uniqueId.slice(0, 10)}`;
const token = uniqueId.slice(10, 22);

  const { error } = await supabase.from("journeys").insert({
    organization_id: profile.organization_id,
    applicator_id: applicatorId,
    code,
    token,
    participant_name: participantName,
    participant_email: participantEmail,
    status: "link_sent",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/painel/entrevistados");
}