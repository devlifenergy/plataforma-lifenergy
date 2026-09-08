"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";
import { isValidCpf } from "@/lib/validation";

async function currentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado.");
  const { data: profile, error } = await supabase.from("profiles").select("id, organization_id, role").eq("auth_user_id", user.id).single();
  if (error || !profile) throw new Error("Perfil não encontrado.");
  return { supabase, profile };
}

async function fileToBase64(file: File) { return Buffer.from(await file.arrayBuffer()).toString("base64"); }
function ensureFile(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size <= 0) throw new Error("Selecione um arquivo.");
  if (file.size > 8 * 1024 * 1024) throw new Error("O arquivo deve ter no máximo 8 MB.");
  return file;
}

export async function listTechnicalLibraryDocuments(publicOnly = false) {
  const admin = createAdminClient();
  let query = admin.from("technical_library_documents").select("id, title, description, file_name, mime_type, file_size, is_public, status, created_at").eq("status", "active").order("created_at", { ascending: false });
  if (publicOnly) query = query.eq("is_public", true);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createTechnicalLibraryDocument(formData: FormData) {
  const { profile } = await currentProfile();
  if (profile.role !== "super_admin") throw new Error("Apenas o super usuário pode publicar na Biblioteca Técnica.");
  const file = ensureFile(formData.get("file"));
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const isPublic = String(formData.get("is_public") || "") === "on";
  if (!title) throw new Error("Informe o título do documento.");
  const admin = createAdminClient();
  const { error } = await admin.from("technical_library_documents").insert({
    title, description, file_name: file.name, mime_type: file.type || null, file_size: file.size,
    file_content_base64: await fileToBase64(file), is_public: isPublic, status: "active", created_by: profile.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/painel/biblioteca-tecnica"); revalidatePath("/biblioteca-tecnica");
}

export async function archiveTechnicalLibraryDocument(formData: FormData) {
  const { profile } = await currentProfile();
  if (profile.role !== "super_admin") throw new Error("Acesso não autorizado.");
  const id = String(formData.get("document_id") || "").trim();
  const admin = createAdminClient();
  const { error } = await admin.from("technical_library_documents").update({ status: "archived", updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/painel/biblioteca-tecnica"); revalidatePath("/biblioteca-tecnica");
}

export async function listParticipantDocuments() {
  const { supabase, profile } = await currentProfile();
  if (!profile.organization_id) return [];
  const { data, error } = await supabase.from("participant_documents")
    .select("id, journey_response_id, participant_cpf, title, category, file_name, mime_type, file_size, created_at")
    .eq("organization_id", profile.organization_id).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createParticipantDocument(formData: FormData) {
  const { supabase, profile } = await currentProfile();
  if (!profile.organization_id) throw new Error("Empresa não encontrada.");
  const responseId = String(formData.get("journey_response_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "").trim() || null;
  const file = ensureFile(formData.get("file"));
  if (!responseId || !title) throw new Error("Informe o avaliado e o título do documento.");
  const { data: response, error: responseError } = await supabase.from("journey_responses").select("id, cpf, organization_id").eq("id", responseId).single();
  if (responseError || !response || response.organization_id !== profile.organization_id) throw new Error("Avaliado não encontrado.");
  if (!isValidCpf(response.cpf)) throw new Error("O avaliado não possui CPF válido para o vínculo documental.");
  const { error } = await supabase.from("participant_documents").insert({
    organization_id: profile.organization_id, journey_response_id: response.id, participant_cpf: response.cpf,
    title, category, file_name: file.name, mime_type: file.type || null, file_size: file.size,
    file_content_base64: await fileToBase64(file), created_by: profile.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/painel/biblioteca");
}
