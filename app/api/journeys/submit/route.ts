import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

function getTokenFromReferer(request: Request) {
  const referer = request.headers.get("referer");
  if (!referer) return "";

  const url = new URL(referer);
  const parts = url.pathname.split("/");

  return parts[2] || "";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const supabase = await createClient();

  const tokenFromForm = String(formData.get("token") || "").trim();
  const token = tokenFromForm || getTokenFromReferer(request);

  if (!token) {
    return NextResponse.json({ error: "Token nao enviado." }, { status: 400 });
  }

  const { error } = await supabase.rpc("submit_public_journey_response", {
    p_token: token,
    p_application_date: String(formData.get("application_date") || ""),
    p_initial_time: String(formData.get("initial_time") || ""),
    p_full_name: String(formData.get("nome") || ""),
    p_email: String(formData.get("email") || ""),
    p_naturalidade: String(formData.get("naturalidade") || ""),
    p_cpf: String(formData.get("cpf") || ""),
    p_birth_date: String(formData.get("data_nascimento") || ""),
    p_participation_objective: String(formData.get("objetivo") || ""),
    p_application_type: String(formData.get("tipo_aplicacao") || ""),
    p_applicator_name: String(formData.get("nome_aplicador") || ""),
    p_activity_choice: String(formData.get("escolha_atividade") || ""),
    p_behavior_fractal: String(formData.get("fractal") || ""),
    p_response_1: String(formData.get("resposta_1") || ""),
    p_hierarchy_1: Number(formData.get("hierarquia_1") || 0),
    p_justification_1: String(formData.get("justificativa_1") || ""),
    p_response_2: String(formData.get("resposta_2") || ""),
    p_hierarchy_2: Number(formData.get("hierarquia_2") || 0),
    p_justification_2: String(formData.get("justificativa_2") || ""),
    p_response_3: String(formData.get("resposta_3") || ""),
    p_hierarchy_3: Number(formData.get("hierarquia_3") || 0),
    p_justification_3: String(formData.get("justificativa_3") || ""),
    p_final_feeling: String(formData.get("sentimento_final") || ""),
  });

  if (error) {
    return NextResponse.json({ error: error.message, token }, { status: 400 });
  }

  return NextResponse.redirect(new URL(`/r/${token}/concluido`, request.url), 303);
}
