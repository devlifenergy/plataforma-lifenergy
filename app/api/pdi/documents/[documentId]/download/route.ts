import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

type RouteContext = {
  params: Promise<{ documentId: string }>;
};

function contentDispositionFileName(fileName: string) {
  const safeFallback = fileName.replace(/[^a-zA-Z0-9_.-]+/g, "_");
  return `attachment; filename="${safeFallback}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { documentId } = await context.params;

    if (!documentId) {
      return jsonError("Documento não informado.", 400);
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Usuário não autenticado.", 401);
    }

    const { data: document, error } = await supabase
      .from("organization_documents")
      .select("id, title, file_name, mime_type, file_content_base64, organization_id")
      .eq("id", documentId)
      .eq("status", "active")
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!document) {
      return jsonError("Documento não encontrado.", 404);
    }

    if (!document.file_content_base64) {
      return jsonError(
        "Arquivo original não disponível para download. Atualize este documento para habilitar o download.",
        404
      );
    }

    const fileName = document.file_name || `${document.title || "documento"}.txt`;
    const contentType = document.mime_type || "application/octet-stream";
    const buffer = Buffer.from(document.file_content_base64, "base64");

    return new Response(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDispositionFileName(fileName),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao baixar documento.";
    return jsonError(message, 500);
  }
}
