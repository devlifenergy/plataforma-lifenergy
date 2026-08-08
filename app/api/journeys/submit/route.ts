import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseAdmin";

function getTokenFromReferer(request: Request) {
  const referer = request.headers.get("referer");
  if (!referer) return "";

  const url = new URL(referer);
  const parts = url.pathname.split("/");

  return parts[2] || "";
}

function normalizeDateForDatabase(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return trimmed || null;

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

function normalizeTimeForDatabase(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return trimmed || null;

  const [, hour, minute, second = "00"] = match;
  return `${hour.padStart(2, "0")}:${minute}:${second}`;
}

function parseFractalsJson(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function toHierarchy(value: unknown) {
  const number = Number(value);
  return [1, 2, 3].includes(number) ? number : 0;
}

function asUuidOrNull(value: unknown) {
  const text = clean(value);
  return text || null;
}

type FractalPayload = {
  fractal_id?: string;
  position?: number | string;
  presented_activity?: string;
  copied_activity?: string;
  response_1?: string;
  hierarchy_1?: number | string;
  justification_1?: string;
  response_2?: string;
  hierarchy_2?: number | string;
  justification_2?: string;
  response_3?: string;
  hierarchy_3?: number | string;
  justification_3?: string;
  final_feeling?: string;
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const supabase = createAdminClient();

  const tokenFromForm = String(formData.get("token") || "").trim();
  const token = tokenFromForm || getTokenFromReferer(request);

  if (!token) {
    return NextResponse.json({ error: "Token não enviado." }, { status: 400 });
  }

  const fractals = parseFractalsJson(formData.get("fractals_json")) as FractalPayload[];

  if (fractals.length < 1 || fractals.length > 3) {
    return NextResponse.json(
      { error: "Informe de 1 a 3 fractais.", token },
      { status: 400 }
    );
  }

  const { data: journey, error: journeyError } = await supabase
    .from("journeys")
    .select("id, token, status, organization_id")
    .eq("token", token)
    .single();

  if (journeyError || !journey?.id) {
    return NextResponse.json(
      { error: journeyError?.message ?? "Link não encontrado.", token },
      { status: 400 }
    );
  }

  if (journey.status === "completed" || journey.status === "exported") {
    return NextResponse.json(
      { error: "Este link já foi utilizado e não aceita novas respostas.", token },
      { status: 400 }
    );
  }

  const first = fractals[0];

  const { data: response, error: responseError } = await supabase
    .from("journey_responses")
    .insert({
      journey_id: journey.id,
      organization_id: journey.organization_id,
      application_date: normalizeDateForDatabase(String(formData.get("application_date") || "")),
      initial_time: normalizeTimeForDatabase(String(formData.get("initial_time") || "")),
      full_name: String(formData.get("nome") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      naturalidade: String(formData.get("naturalidade") || "").trim(),
      cpf: String(formData.get("cpf") || "").trim(),
      birth_date: normalizeDateForDatabase(String(formData.get("data_nascimento") || "")),
      participation_objective: String(formData.get("objetivo") || "").trim(),
      application_type: String(formData.get("tipo_aplicacao") || "").trim(),
      applicator_name: String(formData.get("nome_aplicador") || "").trim(),
      activity_choice: String(formData.get("escolha_atividade") || "").trim(),
      behavior_fractal: clean(first.copied_activity),
      response_1: clean(first.response_1),
      hierarchy_1: toHierarchy(first.hierarchy_1),
      justification_1: clean(first.justification_1),
      response_2: clean(first.response_2),
      hierarchy_2: toHierarchy(first.hierarchy_2),
      justification_2: clean(first.justification_2),
      response_3: clean(first.response_3),
      hierarchy_3: toHierarchy(first.hierarchy_3),
      justification_3: clean(first.justification_3),
      final_feeling: clean(first.final_feeling),
    })
    .select("id")
    .single();

  if (responseError || !response?.id) {
    return NextResponse.json(
      { error: responseError?.message ?? "Não foi possível salvar a avaliação.", token },
      { status: 400 }
    );
  }

  const responseFractals = fractals
    .map((item, index) => {
      const position = Number(item.position || index + 1);

      return {
        journey_response_id: response.id,
        journey_fractal_id: asUuidOrNull(item.fractal_id),
        position,
        presented_activity: clean(item.presented_activity),
        copied_activity: clean(item.copied_activity),
        response_1: clean(item.response_1),
        hierarchy_1: toHierarchy(item.hierarchy_1),
        justification_1: clean(item.justification_1),
        response_2: clean(item.response_2),
        hierarchy_2: toHierarchy(item.hierarchy_2),
        justification_2: clean(item.justification_2),
        response_3: clean(item.response_3),
        hierarchy_3: toHierarchy(item.hierarchy_3),
        justification_3: clean(item.justification_3),
        final_feeling: clean(item.final_feeling),
      };
    })
    .filter((item) => item.position >= 1 && item.position <= 3);

  const { error: fractalsError } = await supabase
    .from("journey_response_fractals")
    .insert(responseFractals);

  if (fractalsError) {
    await supabase.from("journey_responses").delete().eq("id", response.id);

    return NextResponse.json(
      { error: fractalsError.message, token },
      { status: 400 }
    );
  }

  const { error: updateError } = await supabase
    .from("journeys")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", journey.id);

  if (updateError) {
    await supabase.from("journey_responses").delete().eq("id", response.id);

    return NextResponse.json(
      { error: updateError.message, token },
      { status: 400 }
    );
  }

  return NextResponse.redirect(new URL(`/r/${token}/concluido`, request.url), 303);
}
