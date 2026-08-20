import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";
import type { LifenergyFractalData, LifenergyV1ReportData } from "./lifenergyV1Types";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function toHierarchy(value: unknown) {
  const number = Number(value || 0);
  return [1, 2, 3].includes(number) ? number : 0;
}

function applicatorNameFromJourney(journey: any) {
  const applicators = journey?.applicators;
  if (Array.isArray(applicators)) return clean(applicators[0]?.name);
  return clean(applicators?.name);
}

function fallbackFractalFromResponse(response: any, journey: any): LifenergyFractalData {
  return {
    position: 1,
    presentedActivity: clean(journey?.activity),
    copiedActivity: clean(response?.behavior_fractal),
    responses: [
      {
        index: 1,
        response: clean(response?.response_1),
        hierarchy: toHierarchy(response?.hierarchy_1),
        justification: clean(response?.justification_1),
      },
      {
        index: 2,
        response: clean(response?.response_2),
        hierarchy: toHierarchy(response?.hierarchy_2),
        justification: clean(response?.justification_2),
      },
      {
        index: 3,
        response: clean(response?.response_3),
        hierarchy: toHierarchy(response?.hierarchy_3),
        justification: clean(response?.justification_3),
      },
    ],
  };
}

function mapResponseFractal(fractal: any): LifenergyFractalData {
  return {
    position: Number(fractal.position || 1),
    presentedActivity: clean(fractal.presented_activity),
    copiedActivity: clean(fractal.copied_activity),
    responses: [
      {
        index: 1,
        response: clean(fractal.response_1),
        hierarchy: toHierarchy(fractal.hierarchy_1),
        justification: clean(fractal.justification_1),
      },
      {
        index: 2,
        response: clean(fractal.response_2),
        hierarchy: toHierarchy(fractal.hierarchy_2),
        justification: clean(fractal.justification_2),
      },
      {
        index: 3,
        response: clean(fractal.response_3),
        hierarchy: toHierarchy(fractal.hierarchy_3),
        justification: clean(fractal.justification_3),
      },
    ],
  };
}

export async function loadLifenergyV1ReportData(
  responseId: string
): Promise<LifenergyV1ReportData> {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, auth_user_id, organization_id, name, email, role")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("Perfil do usuário não encontrado.");
  }

  const { data: response, error: responseError } = await admin
    .from("journey_responses")
    .select("*")
    .eq("id", responseId)
    .single();

  if (responseError || !response) {
    throw new Error("Resposta do avaliado não encontrada.");
  }

  const canAccess =
    profile.role === "super_admin" || profile.organization_id === response.organization_id;

  if (!canAccess) {
    throw new Error("Você não tem permissão para gerar este relatório.");
  }

  const [{ data: organization }, { data: journey, error: journeyError }] = await Promise.all([
    admin
      .from("organizations")
      .select("id, name")
      .eq("id", response.organization_id)
      .single(),
    admin
      .from("journeys")
      .select(
        "id, code, token, status, activity, created_at, completed_at, participant_name, participant_email, applicators(name)"
      )
      .eq("id", response.journey_id)
      .single(),
  ]);

  if (journeyError || !journey) {
    throw new Error("Jornada do avaliado não encontrada.");
  }

  const { data: responseFractals, error: fractalsError } = await admin
    .from("journey_response_fractals")
    .select("*")
    .eq("journey_response_id", response.id)
    .order("position", { ascending: true });

  if (fractalsError) {
    throw new Error(fractalsError.message);
  }

  const fractals =
    responseFractals && responseFractals.length > 0
      ? responseFractals.map(mapResponseFractal)
      : [fallbackFractalFromResponse(response, journey)];

  return {
    profile: {
      id: profile.id,
      role: profile.role,
      organization_id: profile.organization_id,
      name: profile.name,
      email: profile.email,
    },
    organization: {
      id: organization?.id ?? response.organization_id,
      name: clean(organization?.name) || "Empresa",
    },
    journey: {
      id: journey.id,
      code: journey.code,
      token: journey.token,
      status: journey.status,
      created_at: journey.created_at,
      completed_at: journey.completed_at,
      participant_name: journey.participant_name,
      participant_email: journey.participant_email,
      applicator_name: applicatorNameFromJourney(journey),
    },
    response: {
      id: response.id,
      application_date: response.application_date,
      initial_time: response.initial_time,
      full_name: response.full_name,
      cpf: response.cpf,
      email: response.email,
      naturalidade: response.naturalidade,
      birth_date: response.birth_date,
      participation_objective: response.participation_objective,
      application_type: response.application_type,
      applicator_name: response.applicator_name,
      activity_choice: response.activity_choice,
      created_at: response.created_at,
    },
    fractals,
  };
}
