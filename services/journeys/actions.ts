"use server";

import { randomUUID } from "node:crypto";
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

export async function listJourneys() {
  const { supabase, profile } = await getCurrentProfile();

  const { data, error } = await supabase
    .from("journeys")
    .select(
      "id, code, token, participant_name, participant_email, status, created_at, applicators(name)"
    )
    .eq("organization_id", profile.organization_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

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

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createJourney(formData: FormData) {
  const { supabase, profile } = await getCurrentProfile();

  const applicatorId = String(formData.get("applicator_id") || "").trim();
  const participantName = String(
    formData.get("participant_name") || ""
  ).trim();
  const participantEmail = normalizeOptionalField(
    formData.get("participant_email")
  );

  if (!applicatorId) {
    throw new Error("Aplicador obrigatório.");
  }

  if (!participantName) {
    throw new Error("Nome do avaliado obrigatório.");
  }

  const { data: applicator, error: applicatorError } = await supabase
    .from("applicators")
    .select("id")
    .eq("id", applicatorId)
    .eq("organization_id", profile.organization_id)
    .eq("active", true)
    .single();

  if (applicatorError || !applicator) {
    throw new Error("Aplicador ativo não encontrado nesta empresa.");
  }

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

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/painel/entrevistados");
}

export async function updateJourneyParticipant(formData: FormData) {
  const { supabase, profile } = await getCurrentProfile();

  const journeyId = String(formData.get("journey_id") || "").trim();
  const participantName = String(
    formData.get("participant_name") || ""
  ).trim();
  const participantEmail = normalizeOptionalField(
    formData.get("participant_email")
  );

  if (!journeyId || !participantName) {
    throw new Error("Informe o avaliado e o nome.");
  }

  const { data: journey, error: journeyError } = await supabase
    .from("journeys")
    .select("id, status")
    .eq("id", journeyId)
    .eq("organization_id", profile.organization_id)
    .single();

  if (journeyError || !journey) {
    throw new Error("Avaliado não encontrado.");
  }

  if (journey.status === "completed" || journey.status === "exported") {
    throw new Error(
      "Não é permitido editar um avaliado com avaliação concluída."
    );
  }

  const { error } = await supabase
    .from("journeys")
    .update({
      participant_name: participantName,
      participant_email: participantEmail,
    })
    .eq("id", journeyId)
    .eq("organization_id", profile.organization_id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/painel/entrevistados");
}
