import { createAdminClient } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";

type Ctx = { params: Promise<{ documentId: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const { documentId } = await ctx.params;
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("technical_library_documents")
    .select(
      "file_name,mime_type,file_content_base64,is_public,status"
    )
    .eq("id", documentId)
    .single();

  if (error || !data || data.status !== "active") {
    return new Response("Documento não encontrado.", { status: 404 });
  }

  if (!data.is_public) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Não autenticado.", { status: 401 });
    }
  }

  if (!data.file_content_base64 || !data.file_name) {
    return new Response("Este conteúdo não possui documento para visualização.", {
      status: 404,
    });
  }

  const bytes = Buffer.from(data.file_content_base64, "base64");

  return new Response(bytes as unknown as BodyInit, {
    headers: {
      "Content-Type": data.mime_type || "application/pdf",
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(
        data.file_name
      )}`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
