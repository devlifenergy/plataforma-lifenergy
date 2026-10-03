import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";
import { logAuditEvent } from "@/services/audit/auditLog";

type Ctx = { params: Promise<{ documentId: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const { documentId } = await ctx.params;
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("technical_library_documents")
    .select("id, title, file_name, mime_type, file_content_base64, is_public, status")
    .eq("id", documentId)
    .single();

  if (error || !data || data.status !== "active") {
    return new Response("Documento não encontrado.", { status: 404 });
  }

  let actorProfile: any = null;
  let actorUserId: string | null = null;
  let actorEmail: string | null = null;

  if (!data.is_public) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return new Response("Não autenticado.", { status: 401 });

    actorUserId = user.id;
    actorEmail = user.email ?? null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, name, email")
      .eq("auth_user_id", user.id)
      .single();

    actorProfile = profile;
  }

  await logAuditEvent({
    action: "document.downloaded",
    actorUserId,
    actorProfileId: actorProfile?.id ?? null,
    actorName: actorProfile?.name ?? null,
    actorEmail: actorProfile?.email ?? actorEmail,
    entityType: "technical_library_document",
    entityId: data.id,
    description: `Documento da Biblioteca Técnica baixado: ${data.file_name}.`,
    metadata: {
      title: data.title,
      file_name: data.file_name,
      mime_type: data.mime_type,
      is_public: data.is_public,
    },
  });

  const bytes = Buffer.from(data.file_content_base64, "base64");

  return new Response(bytes as unknown as BodyInit, {
    headers: {
      "Content-Type": data.mime_type || "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(data.file_name)}`,
      "Cache-Control": "no-store",
    },
  });
}
