import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";
import { logAuditEvent } from "@/services/audit/auditLog";

type Ctx = { params: Promise<{ documentId: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new Response("Não autenticado.", { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, auth_user_id, organization_id, role, name, email")
    .eq("auth_user_id", user.id)
    .single();

  const { documentId } = await ctx.params;
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("participant_documents")
    .select("id, organization_id, title, file_name, mime_type, file_content_base64")
    .eq("id", documentId)
    .single();

  if (error || !data) return new Response("Documento não encontrado.", { status: 404 });

  if (profile?.role !== "super_admin" && profile?.organization_id !== data.organization_id) {
    return new Response("Acesso negado.", { status: 403 });
  }

  await logAuditEvent({
    action: "document.downloaded",
    organizationId: data.organization_id,
    actorUserId: user.id,
    actorProfileId: (profile as any)?.id ?? null,
    actorName: (profile as any)?.name ?? null,
    actorEmail: (profile as any)?.email ?? user.email ?? null,
    entityType: "participant_document",
    entityId: data.id,
    description: `Documento de participante baixado: ${data.file_name}.`,
    metadata: {
      title: (data as any).title,
      file_name: data.file_name,
      mime_type: data.mime_type,
    },
  });

  return new Response(Buffer.from(data.file_content_base64, "base64") as unknown as BodyInit, {
    headers: {
      "Content-Type": data.mime_type || "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(data.file_name)}`,
      "Cache-Control": "no-store",
    },
  });
}
