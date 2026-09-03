"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabaseServer";
import { findFractalMatrixItem } from "@/services/fractals/lifenergyFractalMatrix";

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

function dateBrToIsoOrNull(value: FormDataEntryValue | null) {
  const raw = String(value || "").trim();
  const br = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;
  const iso = raw.match(/^\d{4}-\d{2}-\d{2}$/);
  return iso ? raw : null;
}

function readFractalActivities(formData: FormData) {
  const countFromForm = Number(formData.get("fractal_count") || 1);
  const fractalCount = [1, 2, 3].includes(countFromForm) ? countFromForm : 1;

  const selections = Array.from({ length: fractalCount }, (_, index) => {
    const position = index + 1;
    const vortex = String(formData.get(`vortex_${position}`) || "").trim();
    const connectionPoint = String(formData.get(`connection_point_${position}`) || "").trim();
    const fractalCode = String(formData.get(`fractal_code_${position}`) || "").trim();
    const selected = findFractalMatrixItem(vortex, connectionPoint, fractalCode);

    if (!selected) {
      throw new Error(`Selecione Vórtice, Ponto de Conexão e Fractal para o Fractal ${position}.`);
    }

    return {
      position,
      activity: selected.fractal.text,
      vortex,
      connection_point: connectionPoint,
      fractal_code: fractalCode,
    };
  });

  const fractalCodes = selections.map((item) => item.fractal_code);
  if (new Set(fractalCodes).size !== fractalCodes.length) {
    throw new Error("Não é permitido selecionar o mesmo Fractal de Comportamento mais de uma vez no mesmo link.");
  }

  return selections;
}

export async function listJourneys() {
  const { supabase, profile } = await getCurrentProfile();

  const { data: journeys, error } = await supabase
    .from("journeys")
    .select(
      "id, code, token, participant_name, participant_email, participant_cpf, participant_naturalidade, participant_birth_date, participant_objective, activity, status, created_at, applicators(name)"
    )
    .eq("organization_id", profile.organization_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const journeyIds = (journeys ?? []).map((item) => item.id);
  const cpfByJourney = new Map<string, string>();
  const responseIdByJourney = new Map<string, string>();
  type JourneyFractalSelection = {
    position: number;
    activity: string;
    vortex: string;
    connection_point: string;
    fractal_code: string;
  };
  const fractalsByJourney = new Map<string, JourneyFractalSelection[]>();

  if (journeyIds.length > 0) {
    const { data: responses, error: responsesError } = await supabase
      .from("journey_responses")
      .select("id, journey_id, cpf, created_at")
      .in("journey_id", journeyIds)
      .order("created_at", { ascending: false });

    if (responsesError) {
      throw new Error(responsesError.message);
    }

    for (const response of responses ?? []) {
      if (response.journey_id && !responseIdByJourney.has(response.journey_id)) {
        responseIdByJourney.set(response.journey_id, response.id);
      }

      if (response.journey_id && response.cpf && !cpfByJourney.has(response.journey_id)) {
        cpfByJourney.set(response.journey_id, response.cpf);
      }
    }

    const { data: fractals, error: fractalsError } = await supabase
      .from("journey_fractals")
      .select("journey_id, position, activity, vortex, connection_point, fractal_code")
      .in("journey_id", journeyIds)
      .order("position", { ascending: true });

    if (!fractalsError) {
      for (const fractal of fractals ?? []) {
        const current = fractalsByJourney.get(fractal.journey_id) ?? [];
        current.push({
          position: Number(fractal.position),
          activity: String(fractal.activity || ""),
          vortex: String((fractal as any).vortex || ""),
          connection_point: String((fractal as any).connection_point || ""),
          fractal_code: String((fractal as any).fractal_code || ""),
        });
        fractalsByJourney.set(fractal.journey_id, current);
      }
    }
  }

  return (journeys ?? []).map((journey) => {
    const fractals: JourneyFractalSelection[] = fractalsByJourney.get(journey.id) ?? [
      {
        position: 1,
        activity: journey.activity || "",
        vortex: "",
        connection_point: "",
        fractal_code: "",
      },
    ];

    return {
      ...journey,
      cpf: cpfByJourney.get(journey.id) ?? (journey as any).participant_cpf ?? null,
      response_id: responseIdByJourney.get(journey.id) ?? null,
      fractals,
      fractal_count: fractals.length,
    };
  });
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
  const participantName = String(formData.get("participant_name") || "").trim();
  const participantEmail = normalizeOptionalField(formData.get("participant_email"));
  const participantCpf = normalizeOptionalField(formData.get("participant_cpf"));
  const participantNaturalidade = normalizeOptionalField(formData.get("participant_naturalidade"));
  const participantBirthDate = dateBrToIsoOrNull(formData.get("participant_birth_date"));
  const participantObjective = normalizeOptionalField(formData.get("participant_objective"));
  const activities = readFractalActivities(formData);
  const firstActivity = activities[0]?.activity ?? "";

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

  const { data: journey, error } = await supabase
    .from("journeys")
    .insert({
      organization_id: profile.organization_id,
      applicator_id: applicatorId,
      code,
      token,
      participant_name: participantName,
      participant_email: participantEmail,
      participant_cpf: participantCpf,
      participant_naturalidade: participantNaturalidade,
      participant_birth_date: participantBirthDate,
      participant_objective: participantObjective,
      activity: firstActivity,
      status: "link_sent",
    })
    .select("id")
    .single();

  if (error || !journey?.id) {
    throw new Error(error?.message ?? "Não foi possível criar o convite.");
  }

  const { error: fractalsError } = await supabase.from("journey_fractals").insert(
    activities.map((item) => ({
      journey_id: journey.id,
      position: item.position,
      activity: item.activity,
      vortex: item.vortex,
      connection_point: item.connection_point,
      fractal_code: item.fractal_code,
    }))
  );

  if (fractalsError) {
    await supabase
      .from("journeys")
      .delete()
      .eq("id", journey.id)
      .eq("organization_id", profile.organization_id);
    throw new Error(fractalsError.message);
  }

  revalidatePath("/painel/entrevistados");
}

export async function updateJourneyParticipant(formData: FormData) {
  const { supabase, profile } = await getCurrentProfile();

  const journeyId = String(formData.get("journey_id") || "").trim();
  const participantName = String(formData.get("participant_name") || "").trim();
  const participantEmail = normalizeOptionalField(formData.get("participant_email"));
  const participantCpf = normalizeOptionalField(formData.get("participant_cpf"));
  const participantNaturalidade = normalizeOptionalField(formData.get("participant_naturalidade"));
  const participantBirthDate = dateBrToIsoOrNull(formData.get("participant_birth_date"));
  const participantObjective = normalizeOptionalField(formData.get("participant_objective"));
  const activities = readFractalActivities(formData);
  const firstActivity = activities[0]?.activity ?? "";

  if (!journeyId || !participantName || !firstActivity) {
    throw new Error("Informe o avaliado, o nome e a atividade.");
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
    throw new Error("Não é permitido editar um avaliado com avaliação concluída.");
  }

  const { error } = await supabase
    .from("journeys")
    .update({
      participant_name: participantName,
      participant_email: participantEmail,
      participant_cpf: participantCpf,
      participant_naturalidade: participantNaturalidade,
      participant_birth_date: participantBirthDate,
      participant_objective: participantObjective,
      activity: firstActivity,
    })
    .eq("id", journeyId)
    .eq("organization_id", profile.organization_id);

  if (error) {
    throw new Error(error.message);
  }

  const { error: deleteError } = await supabase
    .from("journey_fractals")
    .delete()
    .eq("journey_id", journeyId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const { error: insertError } = await supabase.from("journey_fractals").insert(
    activities.map((item) => ({
      journey_id: journeyId,
      position: item.position,
      activity: item.activity,
      vortex: item.vortex,
      connection_point: item.connection_point,
      fractal_code: item.fractal_code,
    }))
  );

  if (insertError) {
    throw new Error(insertError.message);
  }

  revalidatePath("/painel/entrevistados");
}

export async function deletePendingJourney(formData: FormData) {
  const { supabase, profile } = await getCurrentProfile();

  const journeyId = String(formData.get("journey_id") || "").trim();

  if (!journeyId) {
    throw new Error("Link não informado.");
  }

  const { data: journey, error: journeyError } = await supabase
    .from("journeys")
    .select("id, status")
    .eq("id", journeyId)
    .eq("organization_id", profile.organization_id)
    .single();

  if (journeyError || !journey) {
    throw new Error("Link não encontrado.");
  }

  if (journey.status !== "created" && journey.status !== "link_sent") {
    throw new Error("Somente links ainda não respondidos podem ser excluídos.");
  }

  const { count, error: responsesError } = await supabase
    .from("journey_responses")
    .select("id", { count: "exact", head: true })
    .eq("journey_id", journeyId);

  if (responsesError) {
    throw new Error(responsesError.message);
  }

  if ((count ?? 0) > 0) {
    throw new Error("Este link já possui respostas registradas e não pode ser excluído.");
  }

  const { error } = await supabase
    .from("journeys")
    .delete()
    .eq("id", journeyId)
    .eq("organization_id", profile.organization_id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/painel/entrevistados");
}
