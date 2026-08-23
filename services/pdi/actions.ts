"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabaseServer";
import {
  CORPORATE_DOCUMENT_CATEGORIES,
  getCorporateLibraryStatus,
  type CorporateDocumentCategory,
} from "./corporateKnowledge";
import {
  extractCorporateDocumentText,
  generateCorporateDocumentSummary,
} from "./corporateDocumentAI";

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
    .select("id, organization_id, role")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !profile?.organization_id) {
    throw new Error("Perfil da empresa não encontrado.");
  }

  return { supabase, profile };
}

function clean(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function nullable(value: FormDataEntryValue | null) {
  const text = clean(value);
  return text || null;
}

function assertCategory(value: string): CorporateDocumentCategory {
  const allowed = CORPORATE_DOCUMENT_CATEGORIES.map((item) => item.id);
  if (!allowed.includes(value as CorporateDocumentCategory)) {
    throw new Error("Categoria de documento inválida.");
  }
  return value as CorporateDocumentCategory;
}

export async function createOrganizationDocument(formData: FormData) {
  const { supabase, profile } = await getCurrentProfile();

  const category = assertCategory(clean(formData.get("category")));
  const title = clean(formData.get("title"));
  const uploadedFile = formData.get("file");
  const file = uploadedFile instanceof File && uploadedFile.size > 0 ? uploadedFile : null;

  if (!title) {
    throw new Error("Informe o nome do documento.");
  }

  if (!file) {
    throw new Error("Carregue o arquivo do documento para que a IA gere o sumário interno.");
  }

  const extractedText = await extractCorporateDocumentText(file);
  const aiSummary = await generateCorporateDocumentSummary({
    title,
    category,
    extractedText,
  });

  const { error } = await supabase.from("organization_documents").insert({
    organization_id: profile.organization_id,
    category,
    title,
    file_name: file.name,
    mime_type: file.type || null,
    file_size: file.size,
    content_text: aiSummary,
    status: "active",
    created_by: profile.id,
    updated_by: profile.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/painel/pdi");
}

export async function archiveOrganizationDocument(formData: FormData) {
  const { supabase, profile } = await getCurrentProfile();
  const documentId = clean(formData.get("document_id"));

  if (!documentId) {
    throw new Error("Documento não informado.");
  }

  const { error } = await supabase
    .from("organization_documents")
    .update({ status: "archived", updated_by: profile.id })
    .eq("id", documentId)
    .eq("organization_id", profile.organization_id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/painel/pdi");
}

export async function savePdiContext(formData: FormData) {
  const { supabase, profile } = await getCurrentProfile();
  const responseId = clean(formData.get("journey_response_id"));
  const pdiType = clean(formData.get("pdi_type")) === "corporate" ? "corporate" : "relational";
  const personType = clean(formData.get("person_type")) === "employee" ? "employee" : "external";

  if (!responseId) {
    throw new Error("Resposta do avaliado não informada.");
  }

  const { data: response, error: responseError } = await supabase
    .from("journey_responses")
    .select("id, organization_id")
    .eq("id", responseId)
    .single();

  if (responseError || !response) {
    throw new Error("Resposta do avaliado não encontrada.");
  }

  if (response.organization_id !== profile.organization_id && profile.role !== "super_admin") {
    throw new Error("Você não tem permissão para atualizar este contexto de PDI.");
  }

  const { error } = await supabase.from("pdi_contexts").upsert(
    {
      organization_id: response.organization_id,
      journey_response_id: responseId,
      pdi_type: pdiType,
      person_type: personType,
      current_job_title: nullable(formData.get("current_job_title")),
      current_area: nullable(formData.get("current_area")),
      manager_name: nullable(formData.get("manager_name")),
      context_summary: nullable(formData.get("context_summary")),
      current_situation: nullable(formData.get("current_situation")),
      current_challenges: nullable(formData.get("current_challenges")),
      development_priorities: nullable(formData.get("development_priorities")),
      career_direction: nullable(formData.get("career_direction")),
      updated_by: profile.id,
    },
    { onConflict: "journey_response_id" }
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/painel/pdi");
}

export async function listPdiPageData() {
  const { supabase, profile } = await getCurrentProfile();

  const [{ data: documents, error: documentsError }, { data: journeys, error: journeysError }] =
    await Promise.all([
      supabase
        .from("organization_documents")
        .select("id, category, title, file_name, mime_type, file_size, content_text, status, created_at")
        .eq("organization_id", profile.organization_id)
        .eq("status", "active")
        .order("created_at", { ascending: false }),
      supabase
        .from("journeys")
        .select(
          "id, code, status, participant_name, participant_email, created_at, completed_at, applicators(name)"
        )
        .eq("organization_id", profile.organization_id)
        .in("status", ["completed", "exported"])
        .order("completed_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false }),
    ]);

  if (documentsError) {
    throw new Error(documentsError.message);
  }

  if (journeysError) {
    throw new Error(journeysError.message);
  }

  const journeyIds = ((journeys ?? []) as any[]).map((item: any) => item.id);
  const responsesByJourney = new Map<string, any>();

  if (journeyIds.length > 0) {
    const { data: responses, error: responsesError } = await supabase
      .from("journey_responses")
      .select("id, journey_id, cpf, full_name, email, created_at")
      .in("journey_id", journeyIds)
      .order("created_at", { ascending: false });

    if (responsesError) {
      throw new Error(responsesError.message);
    }

    for (const response of responses ?? []) {
      if (response.journey_id && !responsesByJourney.has(response.journey_id)) {
        responsesByJourney.set(response.journey_id, response);
      }
    }
  }

  const responseIds = Array.from(responsesByJourney.values()).map((item: any) => item.id);
  const contextByResponse = new Map<string, any>();
  const pdisByResponse = new Map<string, any[]>();

  if (responseIds.length > 0) {
    const [{ data: contexts, error: contextsError }, { data: pdis, error: pdisError }] =
      await Promise.all([
        supabase
          .from("pdi_contexts")
          .select(
            "id, journey_response_id, pdi_type, person_type, current_job_title, current_area, manager_name, context_summary, current_situation, current_challenges, development_priorities, career_direction"
          )
          .in("journey_response_id", responseIds),
        supabase
          .from("generated_pdis")
          .select("id, journey_response_id, pdi_type, pdi_version, created_at")
          .in("journey_response_id", responseIds)
          .eq("status", "generated")
          .order("created_at", { ascending: false }),
      ]);

    if (contextsError) throw new Error(contextsError.message);
    if (pdisError) throw new Error(pdisError.message);

    for (const context of contexts ?? []) {
      contextByResponse.set(context.journey_response_id, context);
    }

    for (const pdi of pdis ?? []) {
      const current = pdisByResponse.get(pdi.journey_response_id) ?? [];
      current.push(pdi);
      pdisByResponse.set(pdi.journey_response_id, current);
    }
  }

  const candidates = ((journeys ?? []) as any[])
    .map((journey: any) => {
      const response = responsesByJourney.get(journey.id);
      if (!response?.id) return null;

      const applicators = (journey as any).applicators;
      const applicatorName = Array.isArray(applicators)
        ? applicators[0]?.name
        : applicators?.name;

      return {
        journeyId: journey.id,
        responseId: response.id,
        code: journey.code,
        status: journey.status,
        participantName: response.full_name || journey.participant_name,
        participantEmail: response.email || journey.participant_email,
        cpf: response.cpf,
        completedAt: journey.completed_at,
        applicatorName: applicatorName || "-",
        context: contextByResponse.get(response.id) ?? null,
        generatedPdis: pdisByResponse.get(response.id) ?? [],
      };
    })
    .filter(Boolean);

  const activeDocuments = documents ?? [];

  return {
    documents: activeDocuments,
    libraryStatus: getCorporateLibraryStatus(activeDocuments),
    candidates,
    categories: CORPORATE_DOCUMENT_CATEGORIES,
  };
}
