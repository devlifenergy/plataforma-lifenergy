"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";

function required(formData: FormData, key: string) {
  const value = String(formData.get(key) || "").trim();
  if (!value) throw new Error(`Campo obrigatorio ausente: ${key}`);
  return value;
}

function optional(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function toHierarchy(formData: FormData, key: string) {
  const value = Number(required(formData, key));
  if (![1, 2, 3].includes(value)) {
    throw new Error(`Hierarquia invalida: ${key}`);
  }
  return value;
}

export async function submitJourney(token: string, formData: FormData) {
  const supabase = await createClient();

  const applicationType = required(formData, "tipo_aplicacao");
  const applicatorName = optional(formData, "nome_aplicador");

  if (applicationType === "Aplicação Assistida" && !applicatorName) {
    throw new Error("Nome do aplicador e obrigatorio para Aplicacao Assistida.");
  }

  const { error } = await supabase.rpc("submit_public_journey_response", {
    p_token: token,
    p_application_date: required(formData, "application_date"),
    p_initial_time: required(formData, "initial_time"),
    p_full_name: required(formData, "nome"),
    p_email: required(formData, "email"),
    p_naturalidade: required(formData, "naturalidade"),
    p_cpf: required(formData, "cpf"),
    p_birth_date: required(formData, "data_nascimento"),
    p_participation_objective: required(formData, "objetivo"),
    p_application_type: applicationType,
    p_applicator_name: applicatorName,
    p_activity_choice: required(formData, "escolha_atividade"),
    p_behavior_fractal: required(formData, "fractal"),
    p_response_1: required(formData, "resposta_1"),
    p_hierarchy_1: toHierarchy(formData, "hierarquia_1"),
    p_justification_1: required(formData, "justificativa_1"),
    p_response_2: required(formData, "resposta_2"),
    p_hierarchy_2: toHierarchy(formData, "hierarquia_2"),
    p_justification_2: required(formData, "justificativa_2"),
    p_response_3: required(formData, "resposta_3"),
    p_hierarchy_3: toHierarchy(formData, "hierarquia_3"),
    p_justification_3: required(formData, "justificativa_3"),
    p_final_feeling: required(formData, "sentimento_final"),
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/r/${token}/concluido`);
}
