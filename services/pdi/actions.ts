"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabaseServer";
import { createAdminClient } from "@/lib/supabaseAdmin";
import {
  CORPORATE_DOCUMENT_CATEGORIES,
  getCorporateDocumentCategoryLabel,
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

async function fileToBase64(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return buffer.toString("base64");
}

function documentTitleForCategory(category: CorporateDocumentCategory) {
  return getCorporateDocumentCategoryLabel(category);
}

function revalidatePdiAndLibrary() {
  revalidatePath("/painel/pdi");
  revalidatePath("/painel/biblioteca");
}


function assertLogoFile(file: File) {
  const allowed = new Set(["image/png", "image/jpeg"]);

  if (!allowed.has(file.type)) {
    throw new Error("Formato de logomarca inválido. Envie PNG ou JPG.");
  }

  if (file.size > 1024 * 1024) {
    throw new Error("A logomarca deve ter no máximo 1 MB.");
  }
}

export async function updateOrganizationLogo(formData: FormData) {
  const { profile } = await getCurrentProfile();
  const admin = createAdminClient();
  const uploadedFile = formData.get("logo_file");
  const file = uploadedFile instanceof File && uploadedFile.size > 0 ? uploadedFile : null;
  const logoSize = clean(formData.get("logo_size")) || "medium";
  const logoPosition = clean(formData.get("logo_position")) || "center";

  if (!["small", "medium", "large"].includes(logoSize)) throw new Error("Tamanho de logomarca inválido.");
  if (!["left", "center", "right"].includes(logoPosition)) throw new Error("Posição de logomarca inválida.");

  const { data: current, error: currentError } = await admin
    .from("organizations")
    .select("logo_content_base64")
    .eq("id", profile.organization_id)
    .single();
  if (currentError) throw new Error(currentError.message);
  if (!file && !current?.logo_content_base64) throw new Error("Selecione a logomarca da empresa.");

  const updatePayload: Record<string, unknown> = {
    logo_size: logoSize,
    logo_position: logoPosition,
    logo_updated_at: new Date().toISOString(),
  };

  if (file) {
    assertLogoFile(file);
    updatePayload.logo_file_name = file.name;
    updatePayload.logo_mime_type = file.type;
    updatePayload.logo_content_base64 = await fileToBase64(file);
  }

  const { error } = await admin.from("organizations").update(updatePayload).eq("id", profile.organization_id);
  if (error) throw new Error(error.message);

  revalidatePdiAndLibrary();
}

export async function createOrganizationDocument(formData: FormData) {
  const { supabase, profile } = await getCurrentProfile();

  const category = assertCategory(clean(formData.get("category")));
  const title = documentTitleForCategory(category);
  const uploadedFile = formData.get("file");
  const file = uploadedFile instanceof File && uploadedFile.size > 0 ? uploadedFile : null;

  if (!file) {
    throw new Error("Carregue o arquivo do documento para que a IA gere o sumário interno.");
  }

  const [extractedText, fileContentBase64] = await Promise.all([
    extractCorporateDocumentText(file),
    fileToBase64(file),
  ]);

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
    file_content_base64: fileContentBase64,
    content_text: aiSummary,
    status: "active",
    created_by: profile.id,
    updated_by: profile.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePdiAndLibrary();
}

export async function updateOrganizationDocument(formData: FormData) {
  const { supabase, profile } = await getCurrentProfile();

  const documentId = clean(formData.get("document_id"));
  const categoryValue = clean(formData.get("category"));
  const uploadedFile = formData.get("file");
  const file = uploadedFile instanceof File && uploadedFile.size > 0 ? uploadedFile : null;

  if (!documentId) {
    throw new Error("Documento não informado.");
  }

  const category = categoryValue ? assertCategory(categoryValue) : null;
  const updatePayload: Record<string, unknown> = {
    updated_by: profile.id,
  };

  if (category) {
    updatePayload.category = category;
    updatePayload.title = documentTitleForCategory(category);
  }

  if (file) {
    if (!category) {
      throw new Error("Categoria de documento inválida.");
    }

    const effectiveTitle = documentTitleForCategory(category);

    const [extractedText, fileContentBase64] = await Promise.all([
      extractCorporateDocumentText(file),
      fileToBase64(file),
    ]);

    const aiSummary = await generateCorporateDocumentSummary({
      title: effectiveTitle,
      category,
      extractedText,
    });

    updatePayload.title = effectiveTitle;
    updatePayload.category = category;
    updatePayload.file_name = file.name;
    updatePayload.mime_type = file.type || null;
    updatePayload.file_size = file.size;
    updatePayload.file_content_base64 = fileContentBase64;
    updatePayload.content_text = aiSummary;
  }

  const { error } = await supabase
    .from("organization_documents")
    .update(updatePayload)
    .eq("id", documentId)
    .eq("organization_id", profile.organization_id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePdiAndLibrary();
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

  revalidatePdiAndLibrary();
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

  revalidatePdiAndLibrary();
}

export async function listPdiPageData() {
  const { supabase, profile } = await getCurrentProfile();
  const admin = createAdminClient();

  const [{ data: organization, error: organizationError }, { data: documents, error: documentsError }, { data: journeys, error: journeysError }] =
    await Promise.all([
      admin
        .from("organizations")
        .select("id, name, logo_file_name, logo_mime_type, logo_content_base64, logo_updated_at, logo_size, logo_position")
        .eq("id", profile.organization_id)
        .single(),
      supabase
        .from("organization_documents")
        .select("id, category, title, file_name, mime_type, file_size, content_text, status, created_at, updated_at")
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

  if (organizationError) {
    throw new Error(organizationError.message);
  }

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
    organization: organization ?? null,
    documents: activeDocuments,
    libraryStatus: getCorporateLibraryStatus(activeDocuments),
    candidates,
    categories: CORPORATE_DOCUMENT_CATEGORIES,
  };
}
